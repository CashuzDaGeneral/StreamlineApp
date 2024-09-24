{pkgs}: {
  deps = [
    pkgs.nodePackages.prettier
    pkgs.glibcLocales
    pkgs.postgresql
  ];
}
