.DELETE_ON_ERROR:

version-major version-minor version-patch:
	@npm version $(@:version-%=%)

publish:
	@git push --tags origin HEAD:master
	@npm publish
