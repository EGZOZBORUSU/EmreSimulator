import urllib.request
import shutil
import os

VIDEOS = [
    {
        "name": "video_snow.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Snow_falling_in_Tuntorp.webm"
    },
    {
        "name": "video_street_lamp_snow.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Snow_under_LED_street_light_in_Tuntorp%2C_Brastad.webm"
    },
    {
        "name": "video_street_rain.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Rain_in_Rome.webm"
    },
    {
        "name": "video_night_traffic.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Traffic_on_bridge_at_night.webm"
    },
    {
        "name": "video_sea_waves.webm",
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/09/Water_waves_in_Herzliya_beach.webm"
    }
]

out_dir = os.path.join("public", "videos")
os.makedirs(out_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://commons.wikimedia.org/'
}

for item in VIDEOS:
    target = os.path.join(out_dir, item["name"])
    if os.path.exists(target) and os.path.getsize(target) > 1000000:
        print(f"Skipping {item['name']}, already exists.")
        continue
    print(f"Downloading {item['name']}...")
    try:
        req = urllib.request.Request(item["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp, open(target, "wb") as f:
            shutil.copyfileobj(resp, f)
        print(f"Downloaded {item['name']}: {round(os.path.getsize(target)/(1024*1024), 2)} MB")
    except Exception as e:
        print(f"Error downloading {item['name']}: {e}")

print("All extra videos processed!")
