#!/usr/bin/env python
# Name: Kevin Vuong
# Student number: 10730141
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # amount of films is set at 50, is changeable
    info, topfilms = 5, 50
    Matrix = [['-' for x in range(info)] for y in range(topfilms)]

    # go through the amount of films you want to look through
    for y in range(topfilms):
        # division containing relevant content
        entry = dom.by_tag('div.lister-item-content')[y]

	# film title
        for film in entry.by_tag('h3'):
            title = film.by_tag('a')[0]
            Matrix[y][0] = title.content.encode('utf-8')

	# rating of the film	
        for rating in entry.by_tag('strong'):
            Matrix[y][1] = float(rating.content.encode('utf-8'))

	# genre(s) of the film
        for genre in entry.by_tag('span.genre'):
            category = genre.content[1:-12].encode('utf-8')
            Matrix[y][2] = category

	# the actor(s)
        actors = []
        for information in entry.by_tag('p'):
            for actor in information.by_tag('a'):
                actors.append(actor.content.encode('utf-8'))
        actors = ', '.join(actors)
        Matrix[y][3] = actors

	# runtime of the film
        for runtime in entry.by_tag('span.runtime'):
            Matrix[y][4] = int(runtime.content[:-4].encode('utf-8'))

    # return matrix of relevant information of all the scraped films
    return Matrix

def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write down each film with it's own respective row
    for row in range(len(tvseries)):
        writer.writerow(tvseries[row][:])
        
if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)

    print 'IMDB scraped.'
