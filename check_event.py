from pynostr.event import Event
e = Event(pubkey='abc', kind=1, content='', created_at=0, tags=[])
print([a for a in dir(e) if not a.startswith('_')])