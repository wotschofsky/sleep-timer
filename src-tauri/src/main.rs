
#![cfg_attr(
   all(not(debug_assertions), target_os = "windows"),
   windows_subsystem = "windows"
)]

use std::process::Command;
use std::env;

#[tauri::command]
fn sleep() -> () {
   match env::consts::OS {
      "linux" => {
         Command::new("sh")
                  .arg("-c")
                  .arg("systemctl suspend")
                  .output()
                  .expect("failed to execute process");
      },
      "macos" => {
         Command::new("sh")
                  .arg("-c")
                  .arg("pmset sleepnow")
                  .output()
                  .expect("failed to execute process");
      },
      "windows" => {
         Command::new("cmd")
                  .arg("-c")
                  .arg("shutdown /h")
                  .output()
                  .expect("failed to execute process");
      },
      _ => {
         println!("Unsupported OS");
      }
   }
}

#[tauri::command]
fn shutdown() -> () {
   match env::consts::OS {
      "linux" => {
         Command::new("sh")
                  .arg("-c")
                  .arg("shutdown now")
                  .output()
                  .expect("failed to execute process");
      },
      "macos" => {
         Command::new("sh")
                  .arg("-c")
                  .arg("osascript -e 'tell app \"System Events\" to shut down'")
                  .output()
                  .expect("failed to execute process");
      },
      "windows" => {
         Command::new("cmd")
                  .arg("-c")
                  .arg("shutdown /s")
                  .output()
                  .expect("failed to execute process");
      },
      _ => {
         println!("Unsupported OS");
      }
   }
}

fn main() {
   tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![sleep, shutdown])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
