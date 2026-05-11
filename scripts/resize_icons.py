from PIL import Image
import os

def resize_image(src, dest, size=(32, 32)):
    if not os.path.exists(src):
        print(f"Source not found: {src}")
        return
    img = Image.open(src)
    img = img.resize(size, Image.Resampling.LANCZOS)
    img.save(dest)
    print(f"Resized {src} to {dest}")

# Paths
base_dir = "static/images"
dest_dir = os.path.join(base_dir, "Search")

# Icons mapping
icons = {
    "Dark/NetCoreOps_dark_icon_users.png": "dark_users.png",
    "Light/NetCoreOps_light_icon_users.png": "light_users.png",
    "Dark/NetCoreOps_dark_icon_client_pc.png": "dark_device.png",
    "Light/NetCoreOps_light_icon_client_pc.png": "light_device.png"
}

for src_rel, dest_name in icons.items():
    src_path = os.path.join(base_dir, src_rel)
    dest_path = os.path.join(dest_dir, dest_name)
    resize_image(src_path, dest_path)
