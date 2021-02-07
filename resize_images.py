from PIL import Image
import os

path = "client/public/assets/plant-images"
newpath = "client/public/assets/plant-avatars"

paths = [os.path.join(path, fn) for fn in next(os.walk(path))[2]]


for image in paths:
    print(image)
    basewidth = 300
    img = Image.open(image)
    wpercent = (basewidth/float(img.size[0]))
    hsize = int((float(img.size[1])*float(wpercent)))
    img = img.resize((basewidth,hsize), Image.ANTIALIAS)
    new_filename = os.path.join(newpath, image.split('/')[-1])
    
    img.convert('RGB').save(new_filename)