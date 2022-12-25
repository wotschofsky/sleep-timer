
#![cfg_attr(
   all(not(debug_assertions), target_os = "windows"),
   windows_subsystem = "windows"
)]

use system_shutdown::shutdown as system_shutdown;
use system_shutdown::sleep as system_sleep;

#[tauri::command]
fn sleep() -> () {
   match system_sleep() {
      Ok(_) => println!("Shutting down, bye!"),
      Err(error) => eprintln!("Failed to shut down: {}", error),
   }
}

#[tauri::command]
fn shutdown() -> () {
   match system_shutdown() {
      Ok(_) => println!("Shutting down, bye!"),
      Err(error) => eprintln!("Failed to shut down: {}", error),
   }
}

fn main() {
   tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![sleep, shutdown])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
