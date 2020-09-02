defmodule InvetHubWeb.UserController do
 use InvetHubWeb, :controller

 alias InvetHub.Repo
 alias InvetHub.Accounts.User, as: Users
 alias InvetHub.Logs.User_logs, as: SystemLogs

 def index(conn, _params) do
#  user_lists = Accounts.list_users
  user_lists = Users.all()
  render(conn, "index.html", user_lists: user_lists)
 end

 def forget_password(conn, param) do

 end

 def add(conn, params) do
  Ecto.Multi.new()
  |> Ecto.Multi.insert(:user, Users.changeset(%Users{}, params))
  |> Ecto.Multi.run(:system_logs, fn(_repo, %{user: user}) ->
   activity =
     "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" added a new user with user email: \"#{user.email}\" and username:  \"#{user.username}\""

   system_logs = %{
    user_id: conn.assigns.user.id,
    activity: activity
   }

   SystemLogs.changeset(%SystemLogs{}, system_logs)
   |> Repo.insert()
  end)
  |> Repo.transaction()
  |> case do
      {:ok, %{user: user, system_logs: _system_logs}} ->
       conn
       |> put_flash(
           :info,
           "\"#{user.first_name}\" \"#{user.last_name}\" User added successfully"
          )
       |> redirect(to: Routes.user_path(conn, :index))

      {:error, _failed_operation, failed_value, _changes_so_far} ->
       reason = traverse_errors(failed_value.errors) |> List.first()
       conn
       |> put_flash(:error, reason)
       |> redirect(to: Routes.user_path(conn, :index))
     end
    #  rescue
    #    _ ->
    #      conn
    #      |> put_flash(:error, "An error occurred, reason unknown. try again")
    #      |> redirect(to: Routes.users_path(conn, :index))
 end
 @doc """
       transverse errors
 """
 def traverse_errors(errors) do
  for {key, {msg, _opts}} <- errors, do: "#{key} #{msg}"
 end

 def delete(conn, %{"id" => id}) do
   user = Users.find(id)

   Ecto.Multi.new()
   |> Ecto.Multi.delete(:delete_all, user)
   |> Ecto.Multi.run(:system_logs, fn(_repo, %{delete_all: delete_all}) ->
     activity = "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Deleted user with Email \"#{delete_all.email}\" and First Name \"#{delete_all.first_name}\""

     system_logs = %{
       user_id: conn.assigns.user.id,
       activity: activity
     }

     SystemLogs.changeset(%SystemLogs{}, system_logs)
     |> Repo.insert()
   end)
   |> Repo.transaction()
   |> case do
        {:ok, %{delete_all: _delete_all, system_logs: _system_logs}} ->
          conn
          |> put_flash(:info, "Deleted user  successfully.")
          |> redirect(to: Routes.user_path(conn, :index))

        {:error, _failed_operation, failed_value, _changes_so_far} ->
          reason = traverse_errors(failed_value.errors) |> List.first()

          conn
          |> put_flash(:error, reason)
          |> redirect(to: Routes.user_path(conn, :index))
      end
 end

 def update(conn, %{"id" => id} = params) do
   user = Users.find(id)
   Ecto.Multi.new()
   |> Ecto.Multi.update(:user, Users.changeset(user, params))
   |> Ecto.Multi.run(:system_logs, fn(_repo, %{user: user}) ->
     activity =
       "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" updated user details with user email: \"#{user.email}\" and username:  \"#{user.username}\""

     system_logs = %{
       user_id: conn.assigns.user.id,
       activity: activity
     }

     SystemLogs.changeset(%SystemLogs{}, system_logs)
     |> Repo.insert()
   end)
   |> Repo.transaction()
   |> case do
        {:ok, %{user: _user, system_logs: _system_logs}} ->
          conn
          |> put_flash(
               :info,
               "User details have been updated successfully"
             )
          |> redirect(to: Routes.user_path(conn, :index))

        {:error, _failed_operation, failed_value, _changes_so_far} ->
          reason = traverse_errors(failed_value.errors) |> List.first()
          conn
          |> put_flash(:error, reason)
          |> redirect(to: Routes.user_path(conn, :index))
      end
# rescue
#   _ ->
#     conn
#     |> put_flash(:error, "An error occurred, reason unknown. try again")
#     |> redirect(to: Routes.user_path(conn, :index))

 end

 def user_logs(conn, _params) do
   logs = SystemLogs.all(order_by: [desc: :id])
   render(conn, "user_logs.html", logs: logs)
 end

 def system_logs(conn, _params) do
  logs = InvetHub.Logs.System_logs.all(order_by: [desc: :id])
  render(conn, "system_logs.html", logs: logs)
 end

end