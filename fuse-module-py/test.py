import authorize

class Test:
    uid = 1000

ctx = Test()

print(authorize.open('/home/filipe/core/README.md', 0, ctx))
