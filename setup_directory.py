import os
import shutil

def create_directory_structure():
    # Create new directory structure
    os.makedirs('app/static', exist_ok=True)
    os.makedirs('app/templates', exist_ok=True)
    print("New directory structure created.")

def move_react_files():
    # Move React build files to app/static
    source_dir = 'static/react'
    dest_dir = 'app/static'
    
    if os.path.exists(source_dir):
        for item in os.listdir(source_dir):
            s = os.path.join(source_dir, item)
            d = os.path.join(dest_dir, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)
        print("React build files moved to app/static.")
    else:
        print(f"Source directory {source_dir} does not exist.")

if __name__ == "__main__":
    create_directory_structure()
    move_react_files()
    print("Directory setup completed.")
