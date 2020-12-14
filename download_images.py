import wikipedia
import requests
import json
import urllib.request
import csv
import time

WIKI_REQUEST = 'http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles='


def get_wiki_image_url(search_term):
    try:
        result = wikipedia.search(search_term, results = 1)
        wikipedia.set_lang('en')
        wkpage = wikipedia.WikipediaPage(title = result[0])
        title = wkpage.title
        response  = requests.get(WIKI_REQUEST+title)
        json_data = json.loads(response.text)
        img_link = list(json_data['query']['pages'].values())[0]['original']['source']
        return img_link        
    except:
        return 0


with open("plant_care_data.csv") as plant_csv_file:
    reader = csv.DictReader(plant_csv_file)
    for line in reader:
        name = line['scientific_name']
        name = name.split('‘')[0].strip().lower().replace(" ", "-")

        filename = name + ".jpg"
        print(filename)

        wiki_image = get_wiki_image_url(name)
        if wiki_image == 0:
            print("Could not find image for: {}".format(name))
        else:
            urllib.request.urlretrieve(wiki_image, filename)
            time.sleep(1)