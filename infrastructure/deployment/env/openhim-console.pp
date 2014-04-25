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

$source_dir="/root/openhim-console"
$home="/root"

# Install required packages
Package { ensure => "installed" }
package { "apache2": }
package { "git": }
package { "libfontconfig1": }

class { "nodejs":
	version => "stable",
}

exec { "npm-install":
	cwd => "$source_dir",
	command => "npm install",
	require => Class["nodejs"],
}

exec { "install-bower":
	cwd => "$source_dir",
	command => "npm install -g bower",
	require => Class["nodejs"],
}

exec { "install-grunt":
	cwd => "$source_dir",
	command => "npm install -g grunt-cli",
	require => Class["nodejs"],
}

exec { "bower-install":
	cwd => "$source_dir",
	command => "bower --allow-root install",
	require => Exec["install-bower"],
}

exec { "grunt-build":
	cwd => "$source_dir",
	environment => ["HOME=/root"],
	command => "grunt -v",
	require => [ Exec["bower-install"], Exec["install-grunt"] ],
}

exec { "copy-to-appache":
	cwd => "$source_dir",
	command => "cp -R dist/* /var/www/html",
	require => [ Exec["grunt-build"], Package["apache2"] ],
}

file { "${home}/deploy-openhim-console.sh":
	ensure  => file,
	mode    => 770,
	content => template("$source_dir/infrastructure/deployment/update/deploy.sh"),
}
