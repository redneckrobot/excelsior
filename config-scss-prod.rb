# Require any additional compass plugins here.
require 'breakpoint'
require 'sass-media_query_combiner'

# Set this to the root of your project when deployed:
#http_path = "/"
css_dir = "css"
sass_dir = "scss"
images_dir = "images"
javascripts_dir = "js"

# You can select your preferred output style here (can be overridden via the command line):
#output_style = :expanded # or :nested or :compact or :compressed
output_style= :nested

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass

# Since Compass doesn't allow us to name our files ourselves (if you know a way PLEASE TELL :) )
# require 'fileutils'

# on_stylesheet_saved do |file|
#   if File.exists?(file)
#     filename = File.basename(file, File.extname(file))
#     FileUtils.cp(file, "excelsior/css/"+ filename + ".min" + File.extname(file))
#     puts "Renaming To: #{filename + ".min" + File.extname(file)}"
#   end
# end
