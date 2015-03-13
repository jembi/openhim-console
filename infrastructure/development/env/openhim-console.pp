# Puppet manifest
#
# Required modules:
# willdurand/nodejs
#

# defaults for Exec
Exec {
	path => ["/bin", "/sbin", "/usr/bin", "/usr/sbin", "/usr/local/bin", "/usr/local/sbin", "/usr/local/node/node-default/bin/"],
	user => "root",
}

# Install required packages
Package { ensure => "installed" }
package { "git": }
package { "libfontconfig1": }

class { "nodejs":
	version => "stable",
    make_install => false,
}

exec { "npm-install":
	cwd => "/openhim-console",
	command => "npm install",
	require => Class["nodejs"],
}

exec { "install-bower":
	cwd => "/openhim-console",
	command => "npm install -g bower",
	unless => "npm list -g bower",
	require => Class["nodejs"],
}

exec { "install-grunt":
	cwd => "/openhim-console",
	command => "npm install -g grunt-cli",
	unless => "npm list -g grunt-cli",
	require => Class["nodejs"],
}

exec { "bower-install":
	cwd => "/openhim-console",
	command => "bower --allow-root install",
	require => Exec["install-bower"],
}
