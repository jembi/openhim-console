# Puppet manifest
#
# Required modules:
# willdurand/nodejs

# defaults for Exec
Exec {
	path => ["/bin", "/sbin", "/usr/bin", "/usr/sbin", "/usr/local/bin", "/usr/local/sbin", "/usr/local/node/node-default/bin/"],
	user => "root",
}

package { "apache2":
    ensure => "installed",
}

package { "git":
    ensure => "installed",
}

class { "nodejs":
	version => "stable",
}

exec { "npm-install":
	cwd => "/openhim-console",
	command => "npm install",
	require => Class["nodejs"],
}

exec { "install-bower":
	cwd => "/openhim-console",
	command => "npm install -g bower",
	require => Class["nodejs"],
}

exec { "install-grunt":
	cwd => "/openhim-console",
	command => "npm install -g grunt-cli",
	require => Class["nodejs"],
}

exec { "bower-install":
	cwd => "/openhim-console",
	command => "bower --allow-root install",
	require => Exec["install-bower"],
}

exec { "grunt-build":
	cwd => "/openhim-console",
	command => "grunt --force",
	require => [ Exec["bower-install"], Exec["install-grunt"] ],
}

exec { "copy-to-appache":
	cwd => "/openhim-console",
	command => "cp -R dist/* /var/www/",
	require => [ Exec["grunt-build"], Package["apache2"] ],
}