#!/usr/bin/env python
# coding: utf-8

# In[1]:


import requests
from requests.auth import HTTPBasicAuth
import json
import pandas as pd


# In[2]:


COLOR_TASK = 'dodgerblue'
COLOR_STORY = 'green'
COLOR_SUBTASK = 'cyan'
COLOR_BUG = 'red'
COLOR_EPIC = 'darkmagenta'

COLOR_DICT = {
    'purple':'purple',
    'dark_blue':'darkblue',
    'yellow':'orange',
    'grey':'grey',
    'dark_purple':'purple',
    'blue':'blue',
    'dark_orange':'orange',
    'dark_yellow':'gold',
    'blue-gray':'dodgerblue',
    'green':'green'
}


# In[3]:




# In[4]:


response = requests.request("GET", url, headers=headers, auth=auth, params=query)


# In[5]:


projectIssues = json.dumps(json.loads(response.text),
                            sort_keys=True,
                            indent=4,
                            separators=(",", ": "))


# In[6]:


# projectIssues


# In[7]:


dictProjectIssues = json.loads(projectIssues)

listAllIssues = []

# keyIssue, keySummary, keyReporter, keyCreator, keyCustomfield_10033, keyCustomfield_10020, keyIssuetype, keyPriority, keyProject = "", "", "", "", "", "", "", "",""
keyIssue, keySummary, keyReporter, keyCreator, keyCustomfield_10016, keyCustomfield_10020, keyIssuetype, keyPriority, keyProject = "", "", "", "", "", "", "", "",""


# In[8]:


# dictProjectIssues


# In[9]:


# print(json.dumps(dictProjectIssues, indent=4))

# df = json.dumps(dictProjectIssues)
# my_dict = {'name': 'Alice'}
# my_dict.update(dictProjectIssues)
# print(my_dict)  # {'name': 'Bobby', 'age': 30}


# In[10]:


def iterateDictIssues(oIssues, listInner):
    for key, values in oIssues.items():
        print(key, values)
        if(key == "fields"):
            fieldsDict = dict(values)
            iterateDictIssues(fieldsDict, listInner)
        elif (key == "reporter"):
            reporterDict = dict(values)
            iterateDictIssues(reporterDict, listInner)
        elif (key == "creator"):
            creatorDict = dict(values)
            iterateDictIssues(creatorDict, listInner)
        elif (key == "issuetype"):
            issuetypeDict = dict(values)
            iterateDictIssues(issuetypeDict, listInner)
        elif (key == "priority"):
            priorityDict = dict(values)
            iterateDictIssues(priorityDict, listInner)
        elif (key == "project"):
            projectDict = dict(values)
            iterateDictIssues(projectDict, listInner)
        elif(key == 'key'):
            keyIssue = values
            listInner.append(keyIssue)
        elif(key == 'summary'):
            keySummary = values
            listInner.append(keySummary)
        elif(key == "displayName"):
            keyReporter = values
            listInner.append(keyReporter)
        elif(key == "displayName"):
            keyCreator = values
            listInner.append(keyCreator)
#         elif(key == "customfield_10033"):
#             keyCustomfield_10033 = values
#             listInner.append(keyCustomfield_10033)
        elif(key == "customfield_10016"):
            keyCustomfield_10016 = values
            listInner.append(keyCustomfield_10016)
        elif(key == "customfield_10020"):
            keyCustomfield_10020 = values
            listInner.append(keyCustomfield_10020)
        elif(key == "name"):
            keyIssuetype = values
            listInner.append(keyIssuetype)
        elif(key == "name"):
            keyPriority = values
            listInner.append(keyPriority)
        elif(key == "name"):
            keyProject = values
            listInner.append(keyProject)


# In[11]:


for key, value in dictProjectIssues.items():
    if(key == "issues"):
        totalIssues = len(value)
        for eachIssue in range(totalIssues):
            listInner = []
            iterateDictIssues(value[eachIssue], listInner)
            listAllIssues.append(listInner)


# In[12]:


# dfIssues = pd.DataFrame(listAllIssues, columns=["Creator", "Customfield_10020", "Customfield_10033", "Issuetype", "Priority", "ProjectId", "Project", "Reporter", "Summary", "Key"])
dfIssues = pd.DataFrame(listAllIssues, columns=["Creator", "Customfield_10016", "Customfield_10020", "Issuetype", "Priority", "ProjectId", "Project", "Reporter", "Summary", "Key"])


# In[13]:


# columnTiles = ["Key", "Summary", "Reporter", "Project", "ProjectId", "Priority", "Issuetype", "Customfield_10033", "Customfield_10020", "Creator"]
columnTiles = ["Key", "Summary", "Reporter", "Project", "ProjectId", "Priority", "Issuetype", "Customfield_10020", "Customfield_10016", "Creator"]


# In[14]:


# dfIssues


# In[15]:


# dfIssues = dfIssues.reindex(columns=columnTiles)
# dfIssues = dfIssues.reindex(columns=columnTiles)

dfIssues.to_csv('jiraIssues.csv', index=False)


# In[16]:


df = pd.read_csv("jiraIssues.csv")


# In[17]:


import pandas as pd
from ast import literal_eval
import numpy as np
import ast

# replace NaN with '{}' if the column is strings, otherwise replace with {}
df.Customfield_10020 = df.Customfield_10020.fillna('{}')  # if the NaN is in a column of strings
# df.Pollutants = df.Pollutants.fillna({i: {} for i in df.index})  # if the column is not strings

# Convert the column of stringified dicts to dicts
# skip this line, if the column contains dicts
# df.Customfield_10020 = df.Customfield_10020.apply(literal_eval)
df.Customfield_10020 = df.Customfield_10020.apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)
# reset the index if the index is not unique integers from 0 to n-1
# df.reset_index(inplace=True)  # uncomment if needed

# remove and normalize the column of dictionaries, and join the result to df
df = df.join(pd.json_normalize(df.pop('Customfield_10020')))


# In[18]:


df


# In[19]:


df1 = df.rename(columns={0: 'city'})


# In[20]:


df2 = df1.join(pd.DataFrame(df1.pop('city').values.tolist()))


# In[21]:


df2


# In[22]:


# df2 = df2.fillna(8)

# df2["Calories"].fillna(130, inplace = True)


# In[23]:


# df2 = df2.rename(columns={'Key': 'issue_key', 'Summary': 'issue_summary', 'Project': 'project_name', 'Issuetype': 'issuetype', 'Priority': 'priority', 'Customfield_10033': 'storypoints', 'name': 'sprint_name', 'startDate': 'sprint_start_date', 'endDate': 'sprint_end_date', 'state': 'sprint_state', 'completeDate': 'sprint_completed_date'})

df2 = df2.rename(columns={'Key': 'issue_key', 'Summary': 'issue_summary', 'Project': 'project_name', 'Issuetype': 'issuetype', 'Priority': 'priority', 'Customfield_10016': 'storypoints', 'name': 'sprint_name', 'startDate': 'sprint_start_date', 'endDate': 'sprint_end_date', 'state': 'sprint_state', 'completeDate': 'sprint_completed_date'})


# In[24]:


df2["storypoints"].fillna(8, inplace = True)


# In[25]:


# df2["storypoints"] = df2["storypoints"].astype(str)


# In[26]:


index = 0
col = "project_name"
project_name = df2.iloc[index][col]
print("Cell value at ", index, "for column ", col, " : ", project_name)


# ### Getting Sprints

# In[27]:


# import requests


# ### Visualising Sprint Progress - Sprint Velocity

# In[28]:


df2.drop(columns=['Reporter', 'ProjectId', 'Creator', 'boardId', 'goal', 'id'], inplace=True)


# In[29]:


df2 = df2.drop_duplicates()


# In[30]:


df_issues_per_sprint = df2.query("project_name == `project_name`")[['project_name','issuetype','priority','storypoints','sprint_name','sprint_start_date','sprint_end_date']].groupby(['project_name','issuetype','priority','sprint_name','sprint_start_date','sprint_end_date'])['storypoints'].agg(storypoints='sum').reset_index()


# In[31]:


df_issues_per_sprint.to_csv('jiraIssues_modified.csv', index=False)


# In[32]:


import plotly.express as px
import matplotlib.pyplot as plt

fig = px.histogram(df_issues_per_sprint, x="sprint_name", y="storypoints", color='issuetype',
    title='Storypoints per Issue Type',
    labels={'sprint_name':'Sprint Name','issue_count':'Number of Issues','issuetype':'Issue Type'},
    color_discrete_map={
        "Story": COLOR_STORY,
        "Bug": COLOR_BUG,
        "Task": COLOR_TASK,
        "Sub-task": COLOR_SUBTASK})

fig.update_layout(
    yaxis_title="Storypoints",
    xaxis_title="Sprints",
)

fig.write_image('sprint_velocity.png')
fig.show()


# In[33]:


# Count the issues by sprintName and state
# issue_counts = df2.groupby(['sprint_name', 'sprint_state', 'storypoints']).size().reset_index(name='stories')
# Print the issue counts
# print(issue_counts)


# In[34]:


sprints = df2.loc[df2['sprint_state'] == 'closed']


# In[35]:


sprints


# In[36]:


import numpy as np
# sprints['storypoints'] = sprints['storypoints'].astype(int)
# sprints['stories'] = sprints['stories'].astype(int)


# In[37]:


sprints.columns


# In[38]:


# Calculate total number of issues for each sprint
sprint_issue_counts = sprints['sprint_name'].value_counts().sort_index()

# Calculate sprint velocities
sprints['sprint_velocity'] = sprints['storypoints']
sprint_velocities = sprints.groupby('sprint_name')['sprint_velocity'].sum().sort_index()

# Calculate average sprint velocity
average_velocity = sprint_velocities.mean()

# Insert sprint velocities into the dataset
sprints['sprint_velocities'] = sprints['sprint_name'].map(sprint_velocities)

# Insert average sprint velocity into the dataset
sprints['average_sprint_velocity'] = average_velocity


# In[39]:


# Insert sprint velocities into the dataset
sprints['sprint_velocities'] = sprints['sprint_name'].map(sprint_velocities)

# Insert average sprint velocity into the dataset
sprints['average_sprint_velocity'] = average_velocity


# In[40]:


# Insert sprint velocities into the dataset
df2['sprint_velocities'] = df2['sprint_name'].map(sprint_velocities)

# Insert average sprint velocity into the dataset
df2['average_sprint_velocity'] = average_velocity


# In[41]:


df2.loc[df2['sprint_velocities'].isnull(), 'average_sprint_velocity'] = ''


# In[42]:


df2 = df2.sort_values(by="sprint_name", ascending=True)


# In[43]:


df2 = df2.loc[:, ['issue_key', 'issue_summary', 'project_name', 'priority', 'issuetype', 'storypoints', 'sprint_name',  'sprint_start_date', 'sprint_end_date', 'sprint_state', 'sprint_completed_date', 'sprint_velocities', 'average_sprint_velocity']]


# In[44]:


df2.to_csv('sprintvelocitydataset.csv', index=False)


# In[ ]:




