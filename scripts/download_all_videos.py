import urllib.request
import shutil
import os

VIDEOS = [
    {
        "name": "video_smoke.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Smoke_001.webm",
        "referer": "https://commons.wikimedia.org/wiki/File:Smoke_001.webm"
    },
    {
        "name": "video_street_rain.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rain_in_Rome.webm",
        "referer": "https://commons.wikimedia.org/wiki/File:Rain_in_Rome.webm"
    },
    {
        "name": "video_train.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/07/Freight_train_passing_through_Clapham_Junction.webm",
        "referer": "https://commons.wikimedia.org/wiki/File:Freight_train_passing_through_Clapham_Junction.webm"
    },
    {
        "name": "video_night_road.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Night_time_drive_in_Bristol.webm",
        "referer": "https://commons.wikimedia.org/wiki/File:Night_time_drive_in_Bristol.webm"
    }
]

out_dir = os.path.join("public", "videos")
os.makedirs(out_dir, exist_ok=True)

for v in VIDEOS:
    target = os.path.join(out_dir, v["name"])
    if os.path.exists(target) and os.path.getsize(target) > 500000:
        print(f"Skipping {v['name']}, already exists.")
        continue
    print(f"Downloading {v['name']}...")
    try:
        req = urllib.request.Request(v["url"], headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': v["referer"]
        })
        with urllib.request.urlopen(req, timeout=30) as resp, open(target, 'wb') as f:
            shutil.copyfileobj(resp, f)
        print(f"Downloaded {v['name']}: {os.path.getsize(target)} bytes")
    except Exception as e:
        print(f"Failed {v['name']}: {e}")

print("Video batch download finished.")
