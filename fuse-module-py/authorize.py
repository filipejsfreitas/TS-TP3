import os
import psutil
from config import APP_URL
import requests
import pwd

def open(path, flags, ctx):
    '''
    Returns true if the user in the current context is authorized to open the file, false otherwise.
    '''

    # Get current process ID
    pid = os.getpid()
    powner = psutil.Process(pid).username()

    uname = pwd.getpwuid(ctx.uid).pw_name

    print(f'Attempting to authorize request by pid {pid} powner {powner} uname {uname} path {path}')

    # Make HTTP request to server
    r = requests.post(APP_URL + '/api/authorizeOperation', json={
        'owner': powner,
        'user': uname, # Get Unix username from uid
        'file': path
    }, headers={
        'Content-Type': 'application/json'
    }, timeout=30)

    print(f'Request made, reading response')

    # Analyze response body
    data = r.json()

    # Close connection
    r.close()

    return data['success']
