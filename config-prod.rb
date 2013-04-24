# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
#http_path = "/"
css_dir = "css"
sass_dir = "scss"
images_dir = "images"
javascripts_dir = "js"

# You can select your preferred output style here (can be overridden via the command line):
#output_style = :expanded # or :nested or :compact or :compressed
output_style= :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

# Since Compass doesn't allow us to name our files ourselves (if you know a way PLEASE TELL :) ) we create a folder called css-min, copy the files from there to /css with a .min added to them and then hopefully we delete the temp folder
require 'fileutils'

on_stylesheet_saved do |file|
  if File.exists?(file)
    filename = File.basename(file, File.extname(file))
    FileUtils.cp(file, "css/"+ filename + ".min" + File.extname(file))
    puts "Renaming To: #{filename + ".min" + File.extname(file)}"
  end
end