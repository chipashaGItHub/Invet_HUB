defmodule InvetHubWeb.UserView do
  use InvetHubWeb, :view

  def user_lists() do
    InvetHub.Accounts.User.all()
  end


end