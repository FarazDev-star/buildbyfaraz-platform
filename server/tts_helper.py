import sys
import os
import asyncio
import json
import edge_tts

# Load index to edge mapping
MAPPING_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'voiceIndexToEdge.json')
VOICE_MAP = {}
if os.path.exists(MAPPING_PATH):
    try:
        with open(MAPPING_PATH, 'r', encoding='utf-8') as f:
            VOICE_MAP = json.load(f)
    except Exception as e:
        pass

def resolve_voice(raw_voice):
    if not raw_voice:
        return "en-US-AndrewMultilingualNeural"
    
    s = str(raw_voice).strip()
    s_lower = s.lower()

    # 1. Direct Edge Neural voice shortname match
    if "neural" in s_lower:
        return s

    # 2. Lookup by numeric index
    if s in VOICE_MAP:
        return VOICE_MAP[s]
    if s.isdigit() and str(int(s)) in VOICE_MAP:
        return VOICE_MAP[str(int(s))]

    # 3. Lookup by voice-ID (e.g. voice-310)
    if s.startswith("voice-"):
        tail = s.replace("voice-", "")
        if tail in VOICE_MAP:
            return VOICE_MAP[tail]

    # 4. Pakistani Stars & Urdu Male
    if any(k in s_lower for k in ['babar', 'azam', 'imran', 'rizwan', 'shaheen', 'afridi', 'nawaz', 'shahbaz', 'asad', 'urdu male', 'pakistan male']):
        return "ur-PK-AsadNeural"

    # 5. Pakistani & Urdu Female
    if any(k in s_lower for k in ['uzma', 'ayesha', 'fatima', 'sara', 'hina', 'maryam', 'urdu female', 'pakistan female']):
        return "ur-PK-UzmaNeural"

    # 6. Hindi / Bollywood Male
    if any(k in s_lower for k in ['madhur', 'kohli', 'rohit', 'dhoni', 'srk', 'shahrukh', 'salman', 'hindi male', 'india male']):
        return "hi-IN-MadhurNeural"

    # 7. Hindi Female
    if any(k in s_lower for k in ['swara', 'deepika', 'priyanka', 'hindi female']):
        return "hi-IN-SwaraNeural"

    # 8. English / US / UK common handles
    if 'jenny' in s_lower or 'sarah' in s_lower:
        return "en-US-JennyNeural"
    if 'guy' in s_lower or 'announcer' in s_lower:
        return "en-US-GuyNeural"
    if 'ryan' in s_lower or 'british male' in s_lower:
        return "en-GB-RyanNeural"
    if 'libby' in s_lower or 'british female' in s_lower:
        return "en-GB-LibbyNeural"
    if 'andrew' in s_lower:
        return "en-US-AndrewMultilingualNeural"

    # 9. Language general fallback
    if 'urdu' in s_lower or 'pakistan' in s_lower:
        return "ur-PK-AsadNeural"
    if 'hindi' in s_lower or 'india' in s_lower:
        return "hi-IN-MadhurNeural"
    if 'arabic' in s_lower:
        return "ar-SA-HamedNeural"
    if 'spanish' in s_lower:
        return "es-MX-JorgeNeural"
    if 'french' in s_lower:
        return "fr-FR-DeniseNeural"
    if 'german' in s_lower:
        return "de-DE-KatjaNeural"
    if 'japanese' in s_lower:
        return "ja-JP-NanamiNeural"

    return "en-US-AndrewMultilingualNeural"

def format_rate(rate_val):
    if not rate_val:
        return "+0%"
    s = str(rate_val).strip()
    if s.endswith('%'):
        return s if (s.startswith('+') or s.startswith('-')) else f"+{s}"
    try:
        n = int(s)
        return f"+{n}%" if n >= 0 else f"{n}%"
    except:
        return "+0%"

def format_pitch(pitch_val):
    if not pitch_val:
        return "+0Hz"
    s = str(pitch_val).strip()
    if s.endswith('Hz') or s.endswith('hz'):
        return s if (s.startswith('+') or s.startswith('-')) else f"+{s}"
    try:
        n = int(s)
        return f"+{n}Hz" if n >= 0 else f"{n}Hz"
    except:
        return "+0Hz"

async def synthesize(text, voice_name, rate="+0%", pitch="+0Hz", volume="+0%"):
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice_name,
        rate=rate,
        pitch=pitch,
        volume=volume
    )
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    return audio_data

async def main():
    text = None
    raw_voice = "en-US-AndrewMultilingualNeural"
    rate_val = "+0%"
    pitch_val = "+0Hz"
    volume = "+0%"

    if len(sys.argv) > 1 and sys.argv[1] == '--json':
        try:
            stdin_data = sys.stdin.read()
            payload = json.loads(stdin_data) if stdin_data else {}
            text = payload.get('text')
            raw_voice = payload.get('voice') or raw_voice
            rate_val = payload.get('rate') or rate_val
            pitch_val = payload.get('pitch') or pitch_val
        except Exception as err:
            print(json.dumps({"success": False, "error": f"Invalid JSON stdin: {err}"}))
            sys.exit(1)
    elif len(sys.argv) >= 3:
        text = sys.argv[1]
        raw_voice = sys.argv[2]
        rate_val = sys.argv[3] if len(sys.argv) > 3 else "+0%"
        pitch_val = sys.argv[4] if len(sys.argv) > 4 else "+0Hz"
    elif len(sys.argv) == 2:
        text = sys.argv[1]
    else:
        # Check if piped stdin without --json flag
        if not sys.stdin.isatty():
            try:
                stdin_data = sys.stdin.read()
                if stdin_data:
                    payload = json.loads(stdin_data)
                    text = payload.get('text')
                    raw_voice = payload.get('voice') or raw_voice
                    rate_val = payload.get('rate') or rate_val
                    pitch_val = payload.get('pitch') or pitch_val
            except Exception:
                pass

    if not text:
        print(json.dumps({"success": False, "error": "Missing text parameter"}))
        sys.exit(1)

    voice = resolve_voice(raw_voice)
    rate = format_rate(rate_val)
    pitch = format_pitch(pitch_val)

    try:
        audio = await synthesize(text, voice, rate, pitch, volume)
        import base64
        b64 = base64.b64encode(audio).decode("utf-8")
        result = {
            "success": True,
            "voice": voice,
            "bytes": len(audio),
            "audio_base64": b64
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e), "voice": voice}))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
