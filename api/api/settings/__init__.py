from .base import *

if LOCAL == True:
    from .local import *
else:
    from .production import *
