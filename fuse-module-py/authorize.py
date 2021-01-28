import os
import psutil
from config import APP_URL
import requests
import pwd

def open(path, flags, ctx):
    '''
    Returns true if the user in the current context is authorized to open the file, false otherwise.
    '''

    pid = os.getpid() # Get current process ID
    powner = psutil.Process(pid).username() # Get Process Owner username from process id
    uname = pwd.getpwuid(ctx.uid).pw_name # Get Unix username from uid

    print(f'Attempting to authorize request by pid {pid} powner {powner} uname {uname} path {path}')

    # Make HTTP request to server
    r = requests.post(APP_URL + '/api/authorizeOperation', json={
        'owner': powner,
        'user': uname,
        'file': path
    }, headers={
        'Content-Type': 'application/json'
    }, timeout=30)

    # Analyze response body
    data = r.json()

    # Close connection
    r.close()

    return data['success']
