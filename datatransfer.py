import mysql
import sqlalchemy
import datetime as dt
import pymysql.cursors
import pandas as pd
import pymysql
import mysql.connector
import boto3
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
from flaskext.mysql import MySQL
from io import StringIO
from smart_open import smart_open
import warnings
warnings.filterwarnings('ignore')
warnings.simplefilter(action='ignore', category=FutureWarning)

# AWS_ACCESS_KEY_ID = 'AKIAWWLQI54GVO47BBNB'
# AWS_SECRET_ACCESS_KEY_ID = '2S4EA2cTE04NWJjF7ACl8P5M55T1XTHUmhDcqMFm'

with warnings.catch_warnings(record=True):
    warnings.simplefilter("always")

url = 'mysql+mysqlconnector://admin:Ppdts22$$!!@prismpod.cstncerthpii.us-east-1.rds.amazonaws.com:3306/prismpoddev'
connection = sqlalchemy.create_engine(url)

# # Connect to the database
# connection = pymysql.connect(host='prismpod.cstncerthpii.us-east-1.rds.amazonaws.com',
#                             user='admin',
#                             password='Ppdts22$$!!',
#                             database='prismpoddev',
#                             cursorclass=pymysql.cursors.DictCursor)

# Set up AWS credentials and connect to RDS
client = boto3.client('rds', region_name="us-east-1",
                    #   aws_access_key_id=AWS_ACCESS_KEY_ID,
                    #   aws_secret_access_key=AWS_SECRET_ACCESS_KEY_ID
                    )

s3_client = boto3.client('s3', region_name="us-east-1",
                        #  aws_access_key_id=AWS_ACCESS_KEY_ID,
                        #  aws_secret_access_key=AWS_SECRET_ACCESS_KEY_ID
                        )

# Define SQL query to select data from the table
sql_query = "SELECT * FROM candidate"

# Fetch data from the database into a Pandas DataFrame
df = pd.read_sql_query(sql_query, connection)

# Export data to CSV file
df.to_csv("candidate.csv", index=False)

# upload to S3 bucket
s3_client.upload_file('candidate.csv', 'prismpod', 'candidate.csv')

# write a code for getting the spotify songs using api call

import requests
import json

def add():
    sum = 1+2
    return sum

def get_spotify_songs():
    url = "https://api.spotify.com/v1/search?q=track:"
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_song_id(song_name):
    url = "https://api.spotify.com/v1/search?q=track:" + song_name
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_artist_id(artist_name):
    url = "https://api.spotify.com/v1/search?q=artist:" + artist_name
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_album_id(album_name):
    url = "https://api.spotify.com/v1/search?q=album:" + album_name
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_playlist_id(playlist_name):
    url = "https://api.spotify.com/v1/search?q=playlist:" + playlist_name
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_track_id(track_name):
    url = "https://api.spotify.com/v1/search?q=track:" + track_name
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_artists(artist_id):
    url = "https://api.spotify.com/v1/artists/" + artist_id
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_albums(album_id):
    url = "https://api.spotify.com/v1/albums/" + album_id
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_playlists(playlist_id):
    url = "https://api.spotify.com/v1/playlists/" + playlist_id
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

def get_spotify_tracks(track_id):
    url = "https://api.spotify.com/v1/tracks/" + track_id
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()


# write a code for taking one jira story and perform some analytics on it, save the results in a file

def get_jira_story(story_id):
    url = "https://prismpod.atlassian.net/rest/api/2/issue/" + story_id
    headers = {"Content Type"    : "application/json"}
    response = requests.get(url, headers=headers)
    return response.json()

