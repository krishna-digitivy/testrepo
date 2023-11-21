import  mysql.connector
import json


def load_credentials():
    with open('credentials.json') as f:
        return json.load(f)


def mysql_connection():
    credentials = load_credentials()
    params = {
        'host': credentials.get('DB_HOST', ''),
        'user': credentials.get('DB_USER', ''),
        'password': credentials.get('DB_PASSWORD', ''),
        'database': credentials.get('DB_DATABASE', ''),
        'port': int(credentials.get('DB_PORT', 3306))
    }
    return mysql.connector.connect(**params)


def get_jira_show_time(host, database, user, password, pod_ids):
    connection = None
    output_list = []
    try:
        connection = mysql.connector.connect(
            host=host,
            database=database,
            user=user,
            password=password
        )
        if connection.is_connected():
            cursor = connection.cursor()
            query = '''SELECT
                        t_id, pod_id, pod_name, candidate_id, candidate_name, org_code, jira_issue_id, jira_summary, userStory, category, time, sprint_name, jira_project_id, createdAt, modified_date, workeddate, dayoftheweek
                    FROM
                        jira_issues_show_time
                    WHERE pod_id IN ({})'''.format(', '.join(['%s' for _ in pod_ids]))
            params = tuple(pod_ids)
            cursor.execute(query, params)
            myresult = cursor.fetchall()
            for row in myresult:
                output_dict = {
                        'pod_id': row[1],
                        'pod_name': row[2],
                        'candidate_id': row[3],
                        'candidate_name': row[4],
                        'jira_issue_id': row[6],
                        'jira_summary': row[7],
                        'category': row[9],
                        'time': row[10],
                        'sprint_name': row[11],
                        'jira_project_id': row[12]
                }
                output_list.append(output_dict)
            return output_list
        else:
            return None
    except Exception as e:
        return None
    finally:
        cursor.close()
        connection.close()


def get_pods_by_manager_id(host, database, user, password, manager_id, org_code):
    output_list = []
    connection = None
    cursor = None
    try:
        connection = mysql.connector.connect(
            host=host,
            database=database,
            user=user,
            password=password
        )
        cursor = connection.cursor()
        if connection.is_connected():
            query = '''
                        SELECT id
                            FROM pods
                        WHERE clientID = %s
                            AND Client_Code = %s;
                    '''
            params = (manager_id, org_code)
            cursor.execute(query, params)
            myresult = cursor.fetchall()
            for row in myresult:
                output_list.append(row[0])
            return output_list
        else:
            return None
    except Exception as e:
        return None
    finally:
        cursor.close()
        connection.close()


def calculate_average_time(json_data):
    jira_issue_total_time = {}
    jira_issue_count = {}
    jira_issue_categories = {}
    jira_issue_info = {}

    for item in json_data:
        pod_id = item['pod_id']
        pod_name = item['pod_name']
        candidate_id = item['candidate_id']
        candidate_name = item['candidate_name']
        jira_summary = item['jira_summary']
        sprint_name = item['sprint_name']
        jira_project_id = item['jira_project_id']
        jira_issue_id = item['jira_issue_id']
        category = item['category']
        time_str = item['time']

        hours, minutes = map(int, time_str.split(':'))

        total_minutes = hours * 60 + minutes

        if jira_issue_id not in jira_issue_total_time:
            jira_issue_total_time[jira_issue_id] = 0
            jira_issue_count[jira_issue_id] = 0
            jira_issue_categories[jira_issue_id] = []
            jira_issue_info[jira_issue_id] = {
                'pod_id': pod_id,
                'pod_name': pod_name,
                'candidate_id': candidate_id,
                'candidate_name': candidate_name,
                'jira_summary': jira_summary,
                'sprint_name': sprint_name,
                'jira_project_id': jira_project_id,
                'time': []
            }

        jira_issue_total_time[jira_issue_id] += total_minutes
        jira_issue_count[jira_issue_id] += 1

        if category not in jira_issue_categories[jira_issue_id]:
            jira_issue_categories[jira_issue_id].append(category)

        jira_issue_info[jira_issue_id]['time'].append(time_str)

    result = []
    for jira_issue_id in jira_issue_total_time:
        total_time = jira_issue_total_time[jira_issue_id]
        count = jira_issue_count[jira_issue_id]
        avg_time_minutes = total_time / count
        avg_hours = int(avg_time_minutes // 60)
        avg_minutes = int(avg_time_minutes % 60)
        avg_time = f'{avg_hours:02d}:{avg_minutes:02d}'
        categories = jira_issue_categories[jira_issue_id]
        jira_info = jira_issue_info[jira_issue_id]
        jira_info['jira_issue_id'] = jira_issue_id
        jira_info['average_time'] = avg_time
        jira_info['categories'] = categories
        result.append(jira_info)
    return result


def run_code(event=None, context=None):
    outputData = {}
    outputData1 = {}
    try:
        credentials = load_credentials()
        host = credentials.get('DB_HOST', '')
        database = credentials.get('DB_DATABASE', '')
        user = credentials.get('DB_USER', '')
        password = credentials.get('DB_PASSWORD', '')

        manager_id = event.get('manager_id')
        org_code = event.get('org_code')

        pod_ids = get_pods_by_manager_id(host, database, user, password, manager_id, org_code)        
        json_data = get_jira_show_time(host, database, user, password, pod_ids)
        result = calculate_average_time(json_data)
        outputData['jira_show_time_manager'] = result
        
        return {
            'statusCode': 200,
            'body': json.dumps(outputData)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(outputData1)
        }

    except ValueError as ve:
        return {
            'statusCode': 500,
            'body': json.dumps(outputData1)
        }
        
    except TypeError as te:
        return {
            'statusCode': 500,
            'body': json.dumps(outputData1)
        }

    except ClientError as ce:
        return {
            'statusCode': 500,
            'body': json.dumps(outputData1)
        }

    except NameError as ne:
        return {
            'statusCode': 500,
            'body': json.dumps(outputData1)
        }
        
def lambda_handler(event, context):
    return run_code(event, context)