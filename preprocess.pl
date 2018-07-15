#!/usr/bin/perl -w
use strict;
use File::Temp qw(tempfile unlink0);

undef $/;
my $file = <>;
$/ = "\n";

sub html {
        my $str = shift;
        $str =~ s/^\s+//gm;
        $str =~ s/\n//g;
        return "`$str`";
}
$file =~ s#/\*m_html\*/`(.+?)`#html($1)#egs;

sub css {
        my $str = shift;

        my ( $fh, $filename ) = tempfile();

        print $fh $str;

        $str = `cssmin < $filename`;

        unlink0( $fh, $filename );

        return "`$str`";
}
$file =~ s#/\*m_css\*/`(.+?)`#css($1)#egs;

sub version {
        my $version = "";
        if ( -r ".VERSION" ) {
                $version = `cat .VERSION`;

        } else {
                $version = `git rev-parse --short HEAD`;
        }

        chomp $version;

        return "`$version`";
}
$file =~ s#/\*m_version\*/``#version()#egs;

print $file;
