#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::Engine;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::env;
use std::ffi::OsStr;
use std::fs;
use std::io::{Cursor, Write};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager};
use walkdir::WalkDir;
use zip::write::SimpleFileOptions;
use zip::CompressionMethod;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ArtifactFile {
    relative_path: String,
    mime_type: String,
    encoding: String,
    data: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RunAnalysisResponse {
    success: bool,
    job_id: String,
    output_dir: String,
    summary: Value,
    logs: Vec<String>,
    files: Vec<ArtifactFile>,
    status_file: Option<String>,
    stdout_log: Option<String>,
    stderr_log: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StartAnalysisResponse {
    job_id: String,
    status_file: String,
    results_file: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AnalysisStatusResponse {
    job_id: String,
    state: String,
    progress: i64,
    message: String,
    logs: Vec<String>,
    completed: bool,
    success: bool,
    output_dir: Option<String>,
    summary: Value,
    files: Vec<ArtifactFile>,
    status_file: String,
    results_file: String,
    stdout_log: Option<String>,
    stderr_log: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct SimiTermChoice {
    term: String,
    frequency: i64,
    label: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct PreviewSimiTermsResponse {
    success: bool,
    job_id: String,
    terms: Vec<SimiTermChoice>,
    ordered_terms: Vec<String>,
    logs: Vec<String>,
    status_file: Option<String>,
    stdout_log: Option<String>,
    stderr_log: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct BootstrapResponse {
    success: bool,
    message: String,
    installed_now: Vec<String>,
    missing_after: Vec<String>,
    library: Option<String>,
    rscript: Option<String>,
    python: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct DownloadArchiveResponse {
    filename: String,
    mime_type: String,
    encoding: String,
    data: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ArtifactFilesResponse {
    output_dir: String,
    files: Vec<ArtifactFile>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveArchiveResponse {
    filename: String,
    saved_path: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AnnotationDictionaryFileResponse {
    path: String,
    exists: bool,
    content: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct ResetAnnotationDictionaryResponse {
    path: String,
    removed: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveAnnotationDictionaryResponse {
    path: String,
    entries_count: usize,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveAnnotationExportResponse {
    filename: String,
    saved_path: String,
}

fn preferred_runtime_dirs() -> Vec<PathBuf> {
    vec![
        PathBuf::from("/usr/local/bin"),
        PathBuf::from("/opt/homebrew/bin"),
        PathBuf::from("/Library/Frameworks/Python.framework/Versions/Current/bin"),
        PathBuf::from("/Library/Frameworks/Python.framework/Versions/3.12/bin"),
        PathBuf::from("/Library/Frameworks/Python.framework/Versions/3.11/bin"),
        PathBuf::from("/Library/Frameworks/Python.framework/Versions/3.10/bin"),
        PathBuf::from("/Library/Frameworks/R.framework/Resources/bin"),
        PathBuf::from("/usr/bin"),
        PathBuf::from("/bin"),
        PathBuf::from("/usr/sbin"),
        PathBuf::from("/sbin"),
    ]
}

fn runtime_path_value() -> std::ffi::OsString {
    let mut paths: Vec<PathBuf> = Vec::new();

    for candidate in preferred_runtime_dirs() {
        if !paths.iter().any(|existing| existing == &candidate) {
            paths.push(candidate);
        }
    }

    let existing_paths: Vec<PathBuf> = env::var_os("PATH")
        .map(|value| env::split_paths(&value).collect())
        .unwrap_or_default();

    for candidate in existing_paths {
        if !paths.iter().any(|existing| existing == &candidate) {
            paths.push(candidate);
        }
    }

    env::join_paths(paths).unwrap_or_else(|_| {
        std::ffi::OsString::from("/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin")
    })
}

fn resolve_binary_path(env_var: &str, fallback_name: &str, absolute_candidates: &[&str]) -> String {
    if let Ok(explicit) = env::var(env_var) {
        let trimmed = explicit.trim();
        if !trimmed.is_empty() {
            return trimmed.to_string();
        }
    }

    let runtime_path = runtime_path_value();
    for directory in env::split_paths(&runtime_path) {
        let candidate = directory.join(fallback_name);
        if candidate.is_file() {
            return candidate.to_string_lossy().into_owned();
        }
    }

    for candidate in absolute_candidates {
        let path = Path::new(candidate);
        if path.is_file() {
            return path.to_string_lossy().into_owned();
        }
    }

    fallback_name.to_string()
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SaveTextExportResponse {
    filename: String,
    saved_path: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SavePngExportResponse {
    filename: String,
    saved_path: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct HelpFileResponse {
    relative_path: String,
    mime_type: String,
    encoding: String,
    data: String,
}

#[derive(Debug, Deserialize)]
struct PythonRunResponse {
    success: bool,
    job_id: Option<String>,
    output_dir: Option<String>,
    summary: Option<Value>,
    logs: Option<Vec<String>>,
    status_file: Option<String>,
    stdout_log: Option<String>,
    stderr_log: Option<String>,
    message: Option<String>,
}

#[derive(Debug, Deserialize)]
struct PythonPreviewSimiTermsResponse {
    success: bool,
    job_id: Option<String>,
    terms: Option<Vec<SimiTermChoice>>,
    ordered_terms: Option<Vec<String>>,
    logs: Option<Vec<String>>,
    status_file: Option<String>,
    stdout_log: Option<String>,
    stderr_log: Option<String>,
    message: Option<String>,
}

#[derive(Debug, Deserialize)]
struct PythonBootstrapResponse {
    success: bool,
    message: Option<String>,
    installed_now: Option<Vec<String>>,
    missing_after: Option<Vec<String>>,
    library: Option<String>,
    rscript: Option<String>,
    python: Option<String>,
}

fn dev_repo_root() -> Result<PathBuf, String> {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    manifest_dir
        .parent()
        .and_then(Path::parent)
        .map(Path::to_path_buf)
        .ok_or_else(|| "Impossible de déterminer la racine du dépôt.".to_string())
}

fn project_root(app: &AppHandle) -> Result<PathBuf, String> {
    if let Ok(resource_dir) = app.path().resource_dir() {
        let candidate = resource_dir;
        if candidate.join("backend").is_dir()
            && candidate.join("dictionnaires").is_dir()
            && candidate.join("iramuteqlite").is_dir()
        {
            return Ok(candidate);
        }
    }

    dev_repo_root()
}

fn app_data_root(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|error| format!("Impossible de déterminer Application Support : {error}"))?;
    fs::create_dir_all(&dir)
        .map_err(|error| format!("Impossible de préparer Application Support : {error}"))?;
    Ok(dir)
}

fn jobs_root(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app_data_root(app)?.join("jobs");
    fs::create_dir_all(&dir)
        .map_err(|error| format!("Impossible de préparer le dossier des jobs : {error}"))?;
    Ok(dir)
}

fn next_job_id() -> String {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    format!("tauri-{millis}")
}

fn safe_input_name(name: &str) -> String {
    Path::new(name)
        .file_name()
        .unwrap_or_else(|| OsStr::new("corpus.txt"))
        .to_string_lossy()
        .into_owned()
}

fn mime_type_for_path(path: &Path) -> &'static str {
    match path.extension().and_then(OsStr::to_str).unwrap_or_default() {
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "html" | "htm" => "text/html",
        "csv" => "text/csv",
        "txt" => "text/plain",
        "md" => "text/markdown",
        "json" => "application/json",
        _ => "application/octet-stream",
    }
}

fn is_text_path(path: &Path) -> bool {
    matches!(
        path.extension().and_then(OsStr::to_str).unwrap_or_default(),
        "html" | "htm" | "csv" | "txt" | "json" | "md"
    )
}

fn resolve_help_path(app: &AppHandle, relative_path: &str) -> Result<PathBuf, String> {
    let requested = Path::new(relative_path);
    if requested.is_absolute() {
        return Err("Le chemin d'aide doit être relatif au dossier help/ ou images/.".to_string());
    }
    if requested
        .components()
        .any(|component| matches!(component, std::path::Component::ParentDir))
    {
        return Err("Le chemin d'aide est invalide.".to_string());
    }

    let project = project_root(app)?;
    let requested_str = relative_path.replace('\\', "/");
    if let Some(stripped) = requested_str.strip_prefix("images/") {
        return Ok(project.join("images").join(stripped));
    }

    Ok(project.join("help").join(requested))
}

fn collect_artifact_files(dir: &Path, root: &Path, out: &mut Vec<ArtifactFile>) -> Result<(), String> {
    let mut entries = fs::read_dir(dir)
        .map_err(|error| format!("Impossible de lire {dir:?}: {error}"))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| format!("Impossible de parcourir {dir:?}: {error}"))?;

    entries.sort_by_key(|entry| entry.path());

    for entry in entries {
        let path = entry.path();
        if path.is_dir() {
            collect_artifact_files(&path, root, out)?;
            continue;
        }

        let relative_path = path
            .strip_prefix(root)
            .map_err(|error| format!("Chemin d'artefact invalide {path:?}: {error}"))?
            .to_string_lossy()
            .replace('\\', "/");

        let mime_type = mime_type_for_path(&path).to_string();
        let (encoding, data) = if is_text_path(&path) {
            let text = fs::read_to_string(&path)
                .map_err(|error| format!("Impossible de lire {relative_path}: {error}"))?;
            ("utf8".to_string(), text)
        } else {
            let bytes = fs::read(&path)
                .map_err(|error| format!("Impossible de lire {relative_path}: {error}"))?;
            (
                "base64".to_string(),
                base64::engine::general_purpose::STANDARD.encode(bytes),
            )
        };

        out.push(ArtifactFile {
            relative_path,
            mime_type,
            encoding,
            data,
        });
    }

    Ok(())
}

fn parse_python_response(stdout: &[u8], stderr: &[u8]) -> Result<PythonRunResponse, String> {
    serde_json::from_slice(stdout).map_err(|error| {
        let stdout_text = String::from_utf8_lossy(stdout);
        let stderr_text = String::from_utf8_lossy(stderr);
        format!(
            "Reponse Python non lisible: {error}. stdout={stdout_text} stderr={stderr_text}"
        )
    })
}

fn parse_python_preview_simi_terms_response(
    stdout: &[u8],
    stderr: &[u8],
) -> Result<PythonPreviewSimiTermsResponse, String> {
    serde_json::from_slice(stdout).map_err(|error| {
        let stdout_text = String::from_utf8_lossy(stdout);
        let stderr_text = String::from_utf8_lossy(stderr);
        format!(
            "Reponse Python preview similitudes non lisible: {error}. stdout={stdout_text} stderr={stderr_text}"
        )
    })
}

fn parse_python_bootstrap_response(stdout: &[u8], stderr: &[u8]) -> Result<PythonBootstrapResponse, String> {
    serde_json::from_slice(stdout).map_err(|error| {
        let stdout_text = String::from_utf8_lossy(stdout);
        let stderr_text = String::from_utf8_lossy(stderr);
        format!(
            "Reponse bootstrap Python non lisible: {error}. stdout={stdout_text} stderr={stderr_text}"
        )
    })
}

fn parse_r_json_response(stdout: &[u8], stderr: &[u8]) -> Result<Value, String> {
    serde_json::from_slice(stdout).map_err(|error| {
        let stdout_text = String::from_utf8_lossy(stdout);
        let stderr_text = String::from_utf8_lossy(stderr);
        format!(
            "Reponse R non lisible: {error}. stdout={stdout_text} stderr={stderr_text}"
        )
    })
}

fn read_json_value(path: &Path) -> Result<Value, String> {
    let bytes = fs::read(path).map_err(|error| format!("Impossible de lire {:?}: {error}", path))?;
    serde_json::from_slice(&bytes).map_err(|error| format!("JSON illisible {:?}: {error}", path))
}

fn safe_archive_name(name: &str) -> String {
    let sanitized = name
        .chars()
        .map(|ch| match ch {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '.' | '_' | '-' => ch,
            _ => '-',
        })
        .collect::<String>()
        .trim_matches('-')
        .to_string();

    if sanitized.is_empty() {
        "resultats.zip".to_string()
    } else if sanitized.ends_with(".zip") {
        sanitized
    } else {
        format!("{sanitized}.zip")
    }
}

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    let trimmed = url.trim();
    if !(trimmed.starts_with("https://") || trimmed.starts_with("http://")) {
        return Err("Seules les URL http(s) sont autorisées.".to_string());
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(trimmed)
            .spawn()
            .map_err(|error| format!("Impossible d'ouvrir l'URL externe : {error}"))?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(trimmed)
            .spawn()
            .map_err(|error| format!("Impossible d'ouvrir l'URL externe : {error}"))?;
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(["/C", "start", "", trimmed])
            .spawn()
            .map_err(|error| format!("Impossible d'ouvrir l'URL externe : {error}"))?;
    }

    Ok(())
}

#[tauri::command]
fn reveal_in_file_manager(path: String) -> Result<(), String> {
    let target_path = PathBuf::from(path.trim());
    if !target_path.exists() {
        return Err("Le fichier demandé est introuvable.".to_string());
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R"])
            .arg(&target_path)
            .spawn()
            .map_err(|error| format!("Impossible d'ouvrir le dossier du fichier : {error}"))?;
    }

    #[cfg(target_os = "linux")]
    {
        let parent = target_path
            .parent()
            .map(Path::to_path_buf)
            .unwrap_or_else(|| target_path.clone());
        Command::new("xdg-open")
            .arg(parent)
            .spawn()
            .map_err(|error| format!("Impossible d'ouvrir le dossier du fichier : {error}"))?;
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(format!("/select,{}", target_path.to_string_lossy()))
            .spawn()
            .map_err(|error| format!("Impossible d'ouvrir le dossier du fichier : {error}"))?;
    }

    Ok(())
}

#[tauri::command]
fn run_chd_action(
    app: AppHandle,
    output_dir: String,
    action: String,
    term: String,
    class_label: Option<String>,
) -> Result<Value, String> {
    let output_dir_path = PathBuf::from(output_dir.trim());
    if !output_dir_path.exists() || !output_dir_path.is_dir() {
        return Err("Le dossier d'exports est introuvable pour cette action CHD.".to_string());
    }

    let safe_action = action.trim();
    if !matches!(safe_action, "chi2-class" | "segments-class" | "segments-all-classes") {
        return Err("Action CHD non reconnue.".to_string());
    }

    let safe_term = term.trim();
    if safe_term.is_empty() {
        return Err("La forme sélectionnée est vide.".to_string());
    }

    let project_root = project_root(&app)?;
    let app_data_dir = app_data_root(&app)?;
    let rscript_exec = resolve_binary_path(
        "IRAMUTEQ_RSCRIPT",
        "Rscript",
        &[
            "/usr/local/bin/Rscript",
            "/opt/homebrew/bin/Rscript",
            "/Library/Frameworks/R.framework/Resources/bin/Rscript",
        ],
    );
    let runtime_path = runtime_path_value();
    let action_script = project_root.join("backend").join("r").join("actions.R");
    if !action_script.exists() {
        return Err(format!(
            "Le script d'actions CHD est introuvable : {}",
            action_script.to_string_lossy()
        ));
    }

    let mut command = Command::new(&rscript_exec);
    command
        .arg("--vanilla")
        .arg(&action_script)
        .arg("--output-dir")
        .arg(&output_dir_path)
        .arg("--action")
        .arg(safe_action)
        .arg("--term")
        .arg(safe_term)
        .current_dir(&project_root)
        .env("LANG", "en_US.UTF-8")
        .env("LC_CTYPE", "en_US.UTF-8")
        .env("LC_ALL", "en_US.UTF-8")
        .env("PATH", &runtime_path)
        .env("IRAMUTEQ_APP_DATA_DIR", &app_data_dir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    if let Some(class_label) = class_label.as_deref().map(str::trim).filter(|value| !value.is_empty()) {
        command.arg("--class").arg(class_label);
    }

    let output = command
        .output()
        .map_err(|error| format!("Impossible de lancer Rscript ({rscript_exec}) : {error}"))?;

    let response = parse_r_json_response(&output.stdout, &output.stderr)?;
    let success = response
        .get("success")
        .and_then(Value::as_bool)
        .unwrap_or(false);

    if !output.status.success() || !success {
        let message = response
            .get("message")
            .and_then(Value::as_str)
            .map(str::to_string)
            .or_else(|| {
                response
                    .get("logs")
                    .and_then(Value::as_array)
                    .and_then(|logs| logs.last())
                    .and_then(Value::as_str)
                    .map(str::to_string)
            })
            .unwrap_or_else(|| "L'action CHD a échoué.".to_string());
        return Err(message);
    }

    Ok(response)
}

fn classify_archive_entry(path: &str) -> &'static str {
    let normalized = path.replace('\\', "/");
    if normalized.ends_with(".png") || normalized.ends_with(".jpg") || normalized.ends_with(".jpeg") {
        "graphiques"
    } else if normalized.ends_with(".csv") {
        "csv"
    } else if normalized.ends_with(".html") || normalized.ends_with(".htm") {
        "html"
    } else if normalized.ends_with(".txt") {
        "texte"
    } else if normalized.ends_with(".json") {
        "json"
    } else {
        "autres"
    }
}

fn build_archive_manifest(entries: &[String]) -> String {
    let mut lines = Vec::new();
    lines.push("Archive des resultats IRAMUTEQ Lite".to_string());
    lines.push(String::new());
    lines.push(format!("Nombre de fichiers: {}", entries.len()));
    lines.push(String::new());

    let sections = ["csv", "graphiques", "html", "texte", "json", "autres"];
    for section in sections {
        let section_entries = entries
            .iter()
            .filter(|entry| classify_archive_entry(entry) == section)
            .cloned()
            .collect::<Vec<_>>();
        if section_entries.is_empty() {
            continue;
        }

        lines.push(format!("[{}]", section));
        for entry in section_entries {
            lines.push(format!("- {}", entry));
        }
        lines.push(String::new());
    }

    lines.join("\n")
}

fn build_results_archive(output_dir: &Path) -> Result<Vec<u8>, String> {
    let mut cursor = Cursor::new(Vec::new());
    let mut zip = zip::ZipWriter::new(&mut cursor);
    let options = SimpleFileOptions::default().compression_method(CompressionMethod::Deflated);
    let root_prefix = output_dir
        .file_name()
        .and_then(OsStr::to_str)
        .filter(|name| !name.is_empty())
        .unwrap_or("exports")
        .to_string();

    let mut entries = WalkDir::new(output_dir)
        .into_iter()
        .collect::<Result<Vec<_>, _>>()
        .map_err(|error| format!("Impossible de parcourir {output_dir:?}: {error}"))?;
    entries.sort_by_key(|entry| entry.path().to_path_buf());
    let mut archive_paths = Vec::new();

    for entry in entries {
        let path = entry.path();
        if path == output_dir || path.is_dir() {
            continue;
        }

        let relative_path = path
            .strip_prefix(output_dir)
            .map_err(|error| format!("Chemin d'archive invalide {path:?}: {error}"))?
            .to_string_lossy()
            .replace('\\', "/");
        let archive_path = format!("{root_prefix}/{relative_path}");

        zip.start_file(archive_path.clone(), options)
            .map_err(|error| format!("Impossible d'ajouter {archive_path} a l'archive: {error}"))?;

        let bytes = fs::read(path)
            .map_err(|error| format!("Impossible de lire {relative_path} pour l'archive: {error}"))?;
        zip.write_all(&bytes)
            .map_err(|error| format!("Impossible d'ecrire {archive_path} dans l'archive: {error}"))?;
        archive_paths.push(archive_path);
    }

    let manifest_path = format!("{root_prefix}/contenu_archive.txt");
    let manifest = build_archive_manifest(&archive_paths);
    zip.start_file(manifest_path.clone(), options)
        .map_err(|error| format!("Impossible d'ajouter {manifest_path} a l'archive: {error}"))?;
    zip.write_all(manifest.as_bytes())
        .map_err(|error| format!("Impossible d'ecrire {manifest_path} dans l'archive: {error}"))?;

    zip.finish()
        .map_err(|error| format!("Impossible de finaliser l'archive zip: {error}"))?;

    Ok(cursor.into_inner())
}

fn default_downloads_dir() -> PathBuf {
    if let Ok(home) = env::var("HOME") {
        let downloads = PathBuf::from(home).join("Downloads");
        if downloads.is_dir() {
            return downloads;
        }
    }
    env::temp_dir()
}

fn next_available_path(directory: &Path, filename: &str) -> PathBuf {
    let candidate = directory.join(filename);
    if !candidate.exists() {
        return candidate;
    }

    let stem = Path::new(filename)
        .file_stem()
        .and_then(OsStr::to_str)
        .unwrap_or("resultats");
    let extension = Path::new(filename)
        .extension()
        .and_then(OsStr::to_str)
        .unwrap_or("zip");

    for index in 1..10_000 {
        let name = format!("{stem}-{index}.{extension}");
        let path = directory.join(name);
        if !path.exists() {
            return path;
        }
    }

    directory.join(filename)
}

fn annotation_dictionary_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(app_data_root(app)?.join("dictionnaires").join("add_expression_fr.csv"))
}

fn safe_csv_name(name: &str) -> String {
    let sanitized = name
        .chars()
        .map(|ch| match ch {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '.' | '_' | '-' => ch,
            _ => '-',
        })
        .collect::<String>()
        .trim_matches('-')
        .to_string();

    if sanitized.is_empty() {
        "add_expression_fr.csv".to_string()
    } else if sanitized.ends_with(".csv") {
        sanitized
    } else {
        format!("{sanitized}.csv")
    }
}

fn safe_text_name(name: &str) -> String {
    let sanitized = name
        .chars()
        .map(|ch| match ch {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '.' | '_' | '-' => ch,
            _ => '-',
        })
        .collect::<String>()
        .trim_matches('-')
        .to_string();

    if sanitized.is_empty() {
        "sous-corpus.txt".to_string()
    } else if sanitized.ends_with(".txt") {
        sanitized
    } else {
        format!("{sanitized}.txt")
    }
}

fn safe_png_name(name: &str) -> String {
    let sanitized = name
        .chars()
        .map(|ch| match ch {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '.' | '_' | '-' => ch,
            _ => '-',
        })
        .collect::<String>()
        .trim_matches('-')
        .to_string();

    if sanitized.is_empty() {
        "chi2-classes.png".to_string()
    } else if sanitized.ends_with(".png") {
        sanitized
    } else {
        format!("{sanitized}.png")
    }
}

#[tauri::command]
fn bootstrap_dependencies(app: AppHandle) -> Result<BootstrapResponse, String> {
    let project_root = project_root(&app)?;
    let app_data_dir = app_data_root(&app)?;
    let python_exec = resolve_binary_path(
        "IRAMUTEQ_PYTHON",
        "python3",
        &[
            "/usr/local/bin/python3",
            "/opt/homebrew/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/Current/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.12/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.11/bin/python3",
            "/usr/bin/python3",
        ],
    );
    let runtime_path = runtime_path_value();
    let runner_script = project_root.join("backend").join("run_job.py");
    let output = Command::new(&python_exec)
        .arg(&runner_script)
        .arg("bootstrap")
        .current_dir(&project_root)
        .env("LANG", "en_US.UTF-8")
        .env("LC_CTYPE", "en_US.UTF-8")
        .env("PATH", &runtime_path)
        .env("IRAMUTEQ_APP_DATA_DIR", &app_data_dir)
        .output()
        .map_err(|error| format!("Impossible de lancer Python ({python_exec}): {error}"))?;

    let response = parse_python_bootstrap_response(&output.stdout, &output.stderr)?;
    let missing_after = response.missing_after.unwrap_or_default();
    let installed_now = response.installed_now.unwrap_or_default();
    let message = if response.success {
        if installed_now.is_empty() {
            "Dependances R/Python deja disponibles.".to_string()
        } else {
            format!("Dependances installees: {}", installed_now.join(", "))
        }
    } else {
        response
            .message
            .unwrap_or_else(|| "Bootstrap des dépendances en échec.".to_string())
    };

    Ok(BootstrapResponse {
        success: response.success && output.status.success(),
        message,
        installed_now,
        missing_after,
        library: response.library,
        rscript: response.rscript,
        python: response.python,
    })
}

#[tauri::command]
fn run_python_analysis(app: AppHandle, corpus_name: String, corpus_text: String, config: Value) -> Result<RunAnalysisResponse, String> {
    let project_root = project_root(&app)?;
    let app_data_dir = app_data_root(&app)?;
    let jobs_root = jobs_root(&app)?;
    let job_id = next_job_id();
    let job_root = jobs_root.join(&job_id);
    fs::create_dir_all(&job_root)
        .map_err(|error| format!("Impossible de creer le dossier de job: {error}"))?;

    let input_path = job_root.join(format!("input-{}", safe_input_name(&corpus_name)));
    fs::write(&input_path, corpus_text)
        .map_err(|error| format!("Impossible d'ecrire le corpus temporaire: {error}"))?;

    let request_config_path = job_root.join("request-config.json");
    let request_config = serde_json::to_vec_pretty(&config)
        .map_err(|error| format!("Configuration UI invalide: {error}"))?;
    fs::write(&request_config_path, request_config)
        .map_err(|error| format!("Impossible d'ecrire la configuration temporaire: {error}"))?;

    let python_exec = resolve_binary_path(
        "IRAMUTEQ_PYTHON",
        "python3",
        &[
            "/usr/local/bin/python3",
            "/opt/homebrew/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/Current/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.12/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.11/bin/python3",
            "/usr/bin/python3",
        ],
    );
    let runtime_path = runtime_path_value();
    let runner_script = project_root.join("backend").join("run_job.py");
    let annotation_path = annotation_dictionary_path(&app)?;
    let output = Command::new(&python_exec)
        .arg(&runner_script)
        .arg("run")
        .arg("--input")
        .arg(&input_path)
        .arg("--config")
        .arg(&request_config_path)
        .arg("--output-root")
        .arg(&jobs_root)
        .arg("--job-id")
        .arg(&job_id)
        .current_dir(&project_root)
        .env("LANG", "en_US.UTF-8")
        .env("LC_CTYPE", "en_US.UTF-8")
        .env("PATH", &runtime_path)
        .env("IRAMUTEQ_APP_DATA_DIR", &app_data_dir)
        .env("IRAMUTEQ_ADD_EXPRESSION_PATH", &annotation_path)
        .output()
        .map_err(|error| format!("Impossible de lancer Python ({python_exec}): {error}"))?;

    let response = parse_python_response(&output.stdout, &output.stderr)?;

    if !output.status.success() || !response.success {
        let mut message = response
            .message
            .unwrap_or_else(|| "Le job Python a echoue.".to_string());
        if let Some(logs) = response.logs.clone() {
            if !logs.is_empty() {
                message = format!("{message}\n{}", logs.join("\n"));
            }
        }
        return Err(message);
    }

    let output_dir = response
        .output_dir
        .clone()
        .ok_or_else(|| "Le job Python n'a pas renvoye de dossier d'exports.".to_string())?;
    let output_dir_path = PathBuf::from(&output_dir);

    let mut files = Vec::new();
    collect_artifact_files(&output_dir_path, &output_dir_path, &mut files)?;

    Ok(RunAnalysisResponse {
        success: true,
        job_id: response.job_id.unwrap_or(job_id),
        output_dir,
        summary: response.summary.unwrap_or(Value::Null),
        logs: response.logs.unwrap_or_default(),
        files,
        status_file: response.status_file,
        stdout_log: response.stdout_log,
        stderr_log: response.stderr_log,
    })
}

#[tauri::command]
fn start_python_analysis(app: AppHandle, corpus_name: String, corpus_text: String, config: Value) -> Result<StartAnalysisResponse, String> {
    let project_root = project_root(&app)?;
    let app_data_dir = app_data_root(&app)?;
    let jobs_root = jobs_root(&app)?;
    let job_id = next_job_id();
    let job_root = jobs_root.join(&job_id);
    fs::create_dir_all(&job_root)
        .map_err(|error| format!("Impossible de creer le dossier de job: {error}"))?;

    let input_path = job_root.join(format!("input-{}", safe_input_name(&corpus_name)));
    fs::write(&input_path, corpus_text)
        .map_err(|error| format!("Impossible d'ecrire le corpus temporaire: {error}"))?;

    let request_config_path = job_root.join("request-config.json");
    let request_config = serde_json::to_vec_pretty(&config)
        .map_err(|error| format!("Configuration UI invalide: {error}"))?;
    fs::write(&request_config_path, request_config)
        .map_err(|error| format!("Impossible d'ecrire la configuration temporaire: {error}"))?;

    let python_exec = resolve_binary_path(
        "IRAMUTEQ_PYTHON",
        "python3",
        &[
            "/usr/local/bin/python3",
            "/opt/homebrew/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/Current/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.12/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.11/bin/python3",
            "/usr/bin/python3",
        ],
    );
    let runtime_path = runtime_path_value();
    let runner_script = project_root.join("backend").join("run_job.py");
    let annotation_path = annotation_dictionary_path(&app)?;
    Command::new(&python_exec)
        .arg(&runner_script)
        .arg("run")
        .arg("--input")
        .arg(&input_path)
        .arg("--config")
        .arg(&request_config_path)
        .arg("--output-root")
        .arg(&jobs_root)
        .arg("--job-id")
        .arg(&job_id)
        .current_dir(&project_root)
        .env("LANG", "en_US.UTF-8")
        .env("LC_CTYPE", "en_US.UTF-8")
        .env("PATH", &runtime_path)
        .env("IRAMUTEQ_APP_DATA_DIR", &app_data_dir)
        .env("IRAMUTEQ_ADD_EXPRESSION_PATH", &annotation_path)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|error| format!("Impossible de lancer Python ({python_exec}): {error}"))?;

    Ok(StartAnalysisResponse {
        job_id: job_id.clone(),
        status_file: job_root.join("status.json").to_string_lossy().into_owned(),
        results_file: job_root.join("results.json").to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn read_python_analysis_status(app: AppHandle, job_id: String) -> Result<AnalysisStatusResponse, String> {
    let job_root = jobs_root(&app)?.join(&job_id);
    let status_file = job_root.join("status.json");
    let results_file = job_root.join("results.json");
    let stdout_log = job_root.join("stdout.log");
    let stderr_log = job_root.join("stderr.log");

    if !status_file.exists() {
        return Ok(AnalysisStatusResponse {
            job_id,
            state: "queued".to_string(),
            progress: 0,
            message: "Initialisation du job.".to_string(),
            logs: Vec::new(),
            completed: false,
            success: false,
            output_dir: None,
            summary: Value::Null,
            files: Vec::new(),
            status_file: status_file.to_string_lossy().into_owned(),
            results_file: results_file.to_string_lossy().into_owned(),
            stdout_log: Some(stdout_log.to_string_lossy().into_owned()),
            stderr_log: Some(stderr_log.to_string_lossy().into_owned()),
        });
    }

    let status = read_json_value(&status_file)?;
    let state = status
        .get("state")
        .and_then(Value::as_str)
        .unwrap_or("running")
        .to_string();
    let progress = status.get("progress").and_then(Value::as_i64).unwrap_or(0);
    let status_message = status
        .get("message")
        .and_then(Value::as_str)
        .unwrap_or("")
        .to_string();
    let status_logs = status
        .get("logs")
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();

    if !results_file.exists() {
        return Ok(AnalysisStatusResponse {
            job_id,
            state,
            progress,
            message: status_message,
            logs: status_logs,
            completed: false,
            success: false,
            output_dir: None,
            summary: Value::Null,
            files: Vec::new(),
            status_file: status_file.to_string_lossy().into_owned(),
            results_file: results_file.to_string_lossy().into_owned(),
            stdout_log: Some(stdout_log.to_string_lossy().into_owned()),
            stderr_log: Some(stderr_log.to_string_lossy().into_owned()),
        });
    }

    let bytes = fs::read(&results_file)
        .map_err(|error| format!("Impossible de lire {:?}: {error}", results_file))?;
    let response: PythonRunResponse = serde_json::from_slice(&bytes)
        .map_err(|error| format!("Résultats Python illisibles {:?}: {error}", results_file))?;

    let success = response.success;
    let output_dir = response.output_dir.clone();
    let mut files = Vec::new();
    if success {
        if let Some(output_dir_str) = output_dir.as_deref() {
            let output_dir_path = PathBuf::from(output_dir_str);
            if output_dir_path.is_dir() {
                collect_artifact_files(&output_dir_path, &output_dir_path, &mut files)?;
            }
        }
    }

    Ok(AnalysisStatusResponse {
        job_id,
        state,
        progress: progress.max(100),
        message: response
            .message
            .clone()
            .unwrap_or_else(|| status_message.clone()),
        logs: response.logs.unwrap_or(status_logs),
        completed: true,
        success,
        output_dir,
        summary: response.summary.unwrap_or(Value::Null),
        files,
        status_file: response
            .status_file
            .unwrap_or_else(|| status_file.to_string_lossy().into_owned()),
        results_file: results_file.to_string_lossy().into_owned(),
        stdout_log: response
            .stdout_log
            .or_else(|| Some(stdout_log.to_string_lossy().into_owned())),
        stderr_log: response
            .stderr_log
            .or_else(|| Some(stderr_log.to_string_lossy().into_owned())),
    })
}

#[tauri::command]
fn preview_simi_terms(app: AppHandle, corpus_name: String, corpus_text: String, config: Value) -> Result<PreviewSimiTermsResponse, String> {
    let project_root = project_root(&app)?;
    let app_data_dir = app_data_root(&app)?;
    let jobs_root = jobs_root(&app)?;
    let job_id = next_job_id();
    let job_root = jobs_root.join(&job_id);
    fs::create_dir_all(&job_root)
        .map_err(|error| format!("Impossible de creer le dossier de job: {error}"))?;

    let input_path = job_root.join(format!("input-{}", safe_input_name(&corpus_name)));
    fs::write(&input_path, corpus_text)
        .map_err(|error| format!("Impossible d'ecrire le corpus temporaire: {error}"))?;

    let request_config_path = job_root.join("request-config.json");
    let request_config = serde_json::to_vec_pretty(&config)
        .map_err(|error| format!("Configuration UI invalide: {error}"))?;
    fs::write(&request_config_path, request_config)
        .map_err(|error| format!("Impossible d'ecrire la configuration temporaire: {error}"))?;

    let python_exec = resolve_binary_path(
        "IRAMUTEQ_PYTHON",
        "python3",
        &[
            "/usr/local/bin/python3",
            "/opt/homebrew/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/Current/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.12/bin/python3",
            "/Library/Frameworks/Python.framework/Versions/3.11/bin/python3",
            "/usr/bin/python3",
        ],
    );
    let runtime_path = runtime_path_value();
    let runner_script = project_root.join("backend").join("run_job.py");
    let annotation_path = annotation_dictionary_path(&app)?;
    let output = Command::new(&python_exec)
        .arg(&runner_script)
        .arg("preview-simi-terms")
        .arg("--input")
        .arg(&input_path)
        .arg("--config")
        .arg(&request_config_path)
        .arg("--output-root")
        .arg(&jobs_root)
        .arg("--job-id")
        .arg(&job_id)
        .current_dir(&project_root)
        .env("LANG", "en_US.UTF-8")
        .env("LC_CTYPE", "en_US.UTF-8")
        .env("PATH", &runtime_path)
        .env("IRAMUTEQ_APP_DATA_DIR", &app_data_dir)
        .env("IRAMUTEQ_ADD_EXPRESSION_PATH", &annotation_path)
        .output()
        .map_err(|error| format!("Impossible de lancer Python ({python_exec}): {error}"))?;

    let response = parse_python_preview_simi_terms_response(&output.stdout, &output.stderr)?;

    if !output.status.success() || !response.success {
        let mut message = response
            .message
            .unwrap_or_else(|| "Le preview Python des termes de similitudes a echoue.".to_string());
        if let Some(logs) = response.logs.clone() {
            if !logs.is_empty() {
                message = format!("{message}\n{}", logs.join("\n"));
            }
        }
        return Err(message);
    }

    Ok(PreviewSimiTermsResponse {
        success: true,
        job_id: response.job_id.unwrap_or(job_id),
        terms: response.terms.unwrap_or_default(),
        ordered_terms: response.ordered_terms.unwrap_or_default(),
        logs: response.logs.unwrap_or_default(),
        status_file: response.status_file,
        stdout_log: response.stdout_log,
        stderr_log: response.stderr_log,
    })
}

#[tauri::command]
fn download_results_archive(output_dir: String, archive_name: Option<String>) -> Result<DownloadArchiveResponse, String> {
    let output_dir_path = PathBuf::from(&output_dir);
    if !output_dir_path.exists() || !output_dir_path.is_dir() {
        return Err("Le dossier de résultats à télécharger est introuvable.".to_string());
    }

    let filename = safe_archive_name(
        archive_name
            .as_deref()
            .unwrap_or_else(|| output_dir_path.file_name().and_then(OsStr::to_str).unwrap_or("resultats.zip")),
    );
    let bytes = build_results_archive(&output_dir_path)?;

    Ok(DownloadArchiveResponse {
        filename,
        mime_type: "application/zip".to_string(),
        encoding: "base64".to_string(),
        data: base64::engine::general_purpose::STANDARD.encode(bytes),
    })
}

#[tauri::command]
fn save_results_archive(output_dir: String, archive_name: Option<String>) -> Result<SaveArchiveResponse, String> {
    let output_dir_path = PathBuf::from(&output_dir);
    if !output_dir_path.exists() || !output_dir_path.is_dir() {
        return Err("Le dossier de résultats à télécharger est introuvable.".to_string());
    }

    let filename = safe_archive_name(
        archive_name
            .as_deref()
            .unwrap_or_else(|| output_dir_path.file_name().and_then(OsStr::to_str).unwrap_or("resultats.zip")),
    );
    let archive_bytes = build_results_archive(&output_dir_path)?;
    let downloads_dir = default_downloads_dir();
    fs::create_dir_all(&downloads_dir)
        .map_err(|error| format!("Impossible de préparer le dossier de téléchargement : {error}"))?;
    let target_path = next_available_path(&downloads_dir, &filename);

    fs::write(&target_path, archive_bytes)
        .map_err(|error| format!("Impossible d'ecrire l'archive zip: {error}"))?;

    Ok(SaveArchiveResponse {
        filename: target_path
            .file_name()
            .and_then(OsStr::to_str)
            .unwrap_or(&filename)
            .to_string(),
        saved_path: target_path.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn read_annotation_dictionary_file(app: AppHandle) -> Result<AnnotationDictionaryFileResponse, String> {
    let path = annotation_dictionary_path(&app)?;
    if !path.exists() {
        return Ok(AnnotationDictionaryFileResponse {
            path: path.to_string_lossy().into_owned(),
            exists: false,
            content: String::new(),
        });
    }

    let content = fs::read_to_string(&path)
        .map_err(|error| format!("Impossible de lire le dictionnaire d'annotation: {error}"))?;

    Ok(AnnotationDictionaryFileResponse {
        path: path.to_string_lossy().into_owned(),
        exists: true,
        content,
    })
}

#[tauri::command]
fn write_annotation_dictionary_file(app: AppHandle, content: String) -> Result<SaveAnnotationDictionaryResponse, String> {
    let path = annotation_dictionary_path(&app)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
        .map_err(|error| format!("Impossible de préparer le dossier du dictionnaire d'annotation : {error}"))?;
    }

    fs::write(&path, content.as_bytes())
        .map_err(|error| format!("Impossible d'ecrire add_expression_fr.csv: {error}"))?;

    let entries_count = content
        .lines()
        .skip(1)
        .filter(|line| !line.trim().is_empty())
        .count();

    Ok(SaveAnnotationDictionaryResponse {
        path: path.to_string_lossy().into_owned(),
        entries_count,
    })
}

#[tauri::command]
fn reset_annotation_dictionary_file(app: AppHandle) -> Result<ResetAnnotationDictionaryResponse, String> {
    let path = annotation_dictionary_path(&app)?;
    let removed = if path.exists() {
        fs::remove_file(&path)
            .map_err(|error| format!("Impossible de réinitialiser add_expression_fr.csv : {error}"))?;
        true
    } else {
        false
    };

    Ok(ResetAnnotationDictionaryResponse {
        path: path.to_string_lossy().into_owned(),
        removed,
    })
}

#[tauri::command]
fn save_annotation_dictionary_export(
    content: String,
    filename: Option<String>,
) -> Result<SaveAnnotationExportResponse, String> {
    let downloads_dir = default_downloads_dir();
    fs::create_dir_all(&downloads_dir)
        .map_err(|error| format!("Impossible de préparer le dossier de téléchargement : {error}"))?;

    let filename = safe_csv_name(filename.as_deref().unwrap_or("add_expression_fr.csv"));
    let target_path = next_available_path(&downloads_dir, &filename);

    fs::write(&target_path, content.as_bytes())
        .map_err(|error| format!("Impossible d'ecrire add_expression_fr.csv: {error}"))?;

    Ok(SaveAnnotationExportResponse {
        filename: target_path
            .file_name()
            .and_then(OsStr::to_str)
            .unwrap_or(&filename)
            .to_string(),
        saved_path: target_path.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn save_text_export(
    content: String,
    filename: Option<String>,
) -> Result<SaveTextExportResponse, String> {
    let downloads_dir = default_downloads_dir();
    fs::create_dir_all(&downloads_dir)
        .map_err(|error| format!("Impossible de préparer le dossier de téléchargement : {error}"))?;

    let filename = safe_text_name(filename.as_deref().unwrap_or("sous-corpus.txt"));
    let target_path = next_available_path(&downloads_dir, &filename);

    fs::write(&target_path, content.as_bytes())
        .map_err(|error| format!("Impossible d'écrire le sous-corpus: {error}"))?;

    Ok(SaveTextExportResponse {
        filename: target_path
            .file_name()
            .and_then(OsStr::to_str)
            .unwrap_or(&filename)
            .to_string(),
        saved_path: target_path.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn save_png_export(
    data: String,
    filename: Option<String>,
) -> Result<SavePngExportResponse, String> {
    let downloads_dir = default_downloads_dir();
    fs::create_dir_all(&downloads_dir)
        .map_err(|error| format!("Impossible de préparer le dossier de téléchargement : {error}"))?;

    let filename = safe_png_name(filename.as_deref().unwrap_or("chi2-classes.png"));
    let target_path = next_available_path(&downloads_dir, &filename);
    let bytes = base64::engine::general_purpose::STANDARD
        .decode(data.trim())
        .map_err(|error| format!("Données PNG invalides: {error}"))?;

    fs::write(&target_path, bytes)
        .map_err(|error| format!("Impossible d'écrire le graphique PNG: {error}"))?;

    Ok(SavePngExportResponse {
        filename: target_path
            .file_name()
            .and_then(OsStr::to_str)
            .unwrap_or(&filename)
            .to_string(),
        saved_path: target_path.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
fn collect_output_artifacts(output_dir: String) -> Result<ArtifactFilesResponse, String> {
    let output_dir_path = PathBuf::from(&output_dir);
    if !output_dir_path.exists() || !output_dir_path.is_dir() {
        return Err("Le dossier d'exports est introuvable.".to_string());
    }

    let mut files = Vec::new();
    collect_artifact_files(&output_dir_path, &output_dir_path, &mut files)?;

    Ok(ArtifactFilesResponse {
        output_dir,
        files,
    })
}

#[tauri::command]
fn read_help_file(app: AppHandle, relative_path: String) -> Result<HelpFileResponse, String> {
    let path = resolve_help_path(&app, &relative_path)?;
    if !path.exists() || !path.is_file() {
        return Err(format!("Le fichier d'aide est introuvable : {}", relative_path));
    }

    let mime_type = mime_type_for_path(&path).to_string();
    let (encoding, data) = if is_text_path(&path) {
        let text = fs::read_to_string(&path)
            .map_err(|error| format!("Impossible de lire le fichier d'aide {}: {error}", relative_path))?;
        ("utf8".to_string(), text)
    } else {
        let bytes = fs::read(&path)
            .map_err(|error| format!("Impossible de lire le fichier d'aide {}: {error}", relative_path))?;
        (
            "base64".to_string(),
            base64::engine::general_purpose::STANDARD.encode(bytes),
        )
    };

    Ok(HelpFileResponse {
        relative_path,
        mime_type,
        encoding,
        data,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            bootstrap_dependencies,
            run_python_analysis,
            start_python_analysis,
            read_python_analysis_status,
            run_chd_action,
            preview_simi_terms,
            download_results_archive,
            save_results_archive,
            read_annotation_dictionary_file,
            write_annotation_dictionary_file,
            reset_annotation_dictionary_file,
            save_annotation_dictionary_export,
            save_text_export,
            save_png_export,
            collect_output_artifacts,
            read_help_file,
            open_external_url,
            reveal_in_file_manager
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
