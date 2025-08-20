# remove_bg.py
import sys
from rembg import remove
from PIL import Image

input_path = sys.argv[1]
output_path = sys.argv[2]

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
