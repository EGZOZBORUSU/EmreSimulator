import asyncio
import os
import re
import sys
import edge_tts

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

VOICE = "tr-TR-AhmetNeural"
RATE = "-15%"
PITCH = "-5Hz"
CONCURRENCY = 5

async def generate_item(sem, item, out_dir, index, total):
    async with sem:
        out_file = os.path.join(out_dir, f"{item['id']}.mp3")
        temp_file = out_file + ".tmp.mp3"
        print(f"[{index}/{total}] Generating {item['id']}...")
        try:
            communicate = edge_tts.Communicate(item["text"], VOICE, rate=RATE, pitch=PITCH)
            await communicate.save(temp_file)
            if os.path.exists(temp_file):
                if os.path.exists(out_file):
                    os.remove(out_file)
                os.rename(temp_file, out_file)
            print(f"[{index}/{total}] OK: {item['id']}")
        except Exception as e:
            print(f"ERROR on {item['id']}: {e}")
            if os.path.exists(temp_file):
                os.remove(temp_file)

async def main():
    quotes_path = os.path.join("src", "quotes.js")
    with open(quotes_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all { id: "quote_X", text: "..." }
    pattern = re.compile(r'id:\s*["\']([^"\']+)["\'],\s*text:\s*["\']([^"\']+)["\']')
    matches = pattern.findall(content)
    
    print(f"Extracted {len(matches)} quotes directly from src/quotes.js")

    out_dir = os.path.join("public", "audio", "quotes")
    os.makedirs(out_dir, exist_ok=True)

    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = []
    for i, (qid, text) in enumerate(matches, 1):
        item = {"id": qid, "text": text}
        tasks.append(generate_item(sem, item, out_dir, i, len(matches)))

    await asyncio.gather(*tasks)
    print("All audio files successfully generated and synchronized!")

if __name__ == "__main__":
    asyncio.run(main())
