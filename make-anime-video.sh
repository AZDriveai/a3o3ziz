#!/usr/bin/env bash
set -euo pipefail
REF="/home/ubuntu/a3o3ziz/assets/anime-guide-reference.png"
AUDIO="/home/ubuntu/upload/gemini_music.mp3"
OUT="/home/ubuntu/a3o3ziz/assets/anime-guide-intro-with-audio.mp4"
DURATION="30.20"

ffmpeg -y -hide_banner -loglevel error \
  -loop 1 -i "$REF" -i "$AUDIO" \
  -filter_complex "[0:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.00055,1.12)':x='iw/2-(iw/zoom/2)+sin(on/48)*10':y='ih/2-(ih/zoom/2)+cos(on/57)*8':d=1:s=720x1280:fps=30,format=yuv420p[v]" \
  -map "[v]" -map 1:a:0 -t "$DURATION" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -ar 44100 -movflags +faststart \
  "$OUT"

echo "$OUT"
