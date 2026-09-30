use std::path::PathBuf;
use std::process::Command;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let binary_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                    .join("binaries")
                    .join("mukiiq-ai-engine-x86_64-pc-windows-msvc.exe");

                println!(
                    "Starting MUKIIQ AI Engine from: {:?}",
                    binary_path
                );

                Command::new(&binary_path)
                    .current_dir(
                        binary_path
                            .parent()
                            .expect("Failed to get AI engine directory"),
                    )
                    .spawn()
                    .expect("Failed to start MUKIIQ AI Engine");
            }

            #[cfg(not(debug_assertions))]
            {
                use tauri_plugin_shell::ShellExt;

                let sidecar_command = app
                    .shell()
                    .sidecar("mukiiq-ai-engine")
                    .expect("Failed to find AI engine sidecar");

                sidecar_command
                    .spawn()
                    .expect("Failed to start AI engine sidecar");
            }

            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}