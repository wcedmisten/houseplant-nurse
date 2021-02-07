from PIL import Image
import os

path = "client/public/assets/plant-images"
newpath = "tmp_output"

paths = [os.path.join(path, fn) for fn in next(os.walk(path))[2]]

max_width = 2000
max_height = 1500

for image in paths:    
    img = Image.open(image)
    print(image)

    # image doesn't need to be resized, just copied
    if img.size[0] <= max_width and img.size[1] <= max_height:
        new_filename = os.path.join(newpath, image.split('/')[-1])
        img.convert('RGB').save(new_filename)

    # if image width is greater than max width
    elif img.size[0] > max_width:
        wpercent = (max_width/float(img.size[0]))
        hsize = int((float(img.size[1])*float(wpercent)))
        img = img.resize((max_width, hsize), Image.ANTIALIAS)
        new_filename = os.path.join(newpath, image.split('/')[-1])
        
        img.convert('RGB').save(new_filename)
    # if image height is greater than max height
    else:
        hpercent = (max_height/float(img.size[1]))
        wsize = int((float(img.size[0])*float(hpercent)))
        img = img.resize((wsize, max_height), Image.ANTIALIAS)
        new_filename = os.path.join(newpath, image.split('/')[-1])
        
        img.convert('RGB').save(new_filename)