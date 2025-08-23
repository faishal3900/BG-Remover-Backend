# # remove_bg.py
# import sys
# from rembg import remove
# from PIL import Image

# input_path = sys.argv[1]
# output_path = sys.argv[2]

# input_image = Image.open(input_path)
# output_image = remove(input_image)
# output_image.save(output_path)


# remove_bg.py
import sys
from rembg import remove
from PIL import Image

input_path = sys.argv[1]
output_path = sys.argv[2]

with open(input_path, 'rb') as i:
    input_image = i.read()

output = remove(input_image)

with open(output_path, 'wb') as o:
    o.write(output)
