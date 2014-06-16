require 'sinatra'

get '/' do
  haml :index
end

# This defines a "run_command" page. This catches the command that is sent via JS in a form.
# The command is inserted in a string in between backticks to run it from the terminal.
#
# todo: Update this to move to the directory where ADB is located, in case it isn't in the PATH.

post '/run_command' do
  # Execute the command.
  `#{params[:path_to_ADB]}#{params[:command]}`

end
