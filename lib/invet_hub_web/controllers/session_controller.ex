defmodule InvetHubWeb.SessionController do
  use InvetHubWeb, :controller


 alias InvetHub.Email
 alias InvetHub.Mailer
 alias InvetHub.Accounts.User, as: Users
 alias InvetHub.Logs.User_logs, as: User_logs
 alias InvetHub.Auth
#  alias InvetHubWeb.Plugs.RequireAuth

  plug(
    InvetHubWeb.Plugs.RequireAuth
    when action in [
      :sign_out
    ]
  )

  def index(conn, _params) do
    conn = put_layout(conn, false)
    render(conn, "index.html")
  end
  def create(conn, params) do

    with {:error, _reason} <- {:ok, InvetHub.Accounts.User.find_by([email: params["email"]])} do
      conn
      |> put_flash(:error, "email/password did not match")
      |> put_layout(false)
      |> render("index.html")

    else
      {:ok, user} ->
        with {:error, _reason} <- Auth.confirm_password(user, String.trim(params["password"])) do
          conn
          |> put_flash(:error, "email/password did not match")
          |> put_layout(false)
          |> render("index.html")

        else
          {:ok, _} ->
            #            user_logs(conn, params)
            cond do
              user.auto_password != "N" -> #&& user.user_type == "STAFF" ->
                {:ok, _} = InvetHub.Logs.User_logs.create([user_id: user.id, activity: "#{user.first_name}\" \"#{user.last_name}\" logged in"])
                conn

                |> put_session(:current_user, user.id)
                |> put_session(:session_timeout_at, session_timeout_at())

                |> redirect(to: Routes.dashboard_path(conn, :index))


              true ->
                conn
                |> put_layout(false)
                |> redirect(to: Routes.user_path(conn, :change_password))
            end
        end
    end
  end

  defp session_timeout_at do
    DateTime.utc_now() |> DateTime.to_unix() |> (&(&1 + 3_600)).()
  end

  def sign_out(conn, _params) do
    {:ok, _} = InvetHub.Logs.User_logs.create(%{user_id: conn.assigns.user.id, activity: "#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" logged out"})

    conn
    |> configure_session(drop: true)
    |> redirect(to: Routes.session_path(conn, :index))
  rescue
    _ ->
      conn
      |> configure_session(drop: true)
      |> redirect(to: Routes.session_path(conn, :index))
  end

  def recover(conn, _params) do
    conn
    |> put_layout(false)
    |> render("recover_password.html")
  end

  def recover_password(conn, params) do
    user = Users.find_by(email: params["email"])
    
    new_password = "Rcover@09821"
    IO.inspect"------------------------------random password"
    IO.inspect new_password

    Ecto.Multi.new()
    |> Ecto.Multi.update(:user, Users.changeset(user, %{password: new_password, auto_password: N}))
    |> Ecto.Multi.run(:logs, fn(_repo, %{user: user}) ->
      log =
        "\"#{user.email}\" has received the temp password sent through email"

      logs = %{
        activity: log
      }

      User_logs.changeset(%User_logs{}, logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case  do
       nil ->
      conn
      |> put_flash(:error, "User with this email not found")
      |> put_layout(false)
      |> render("recover_password.html")
      user ->
        Email.password(params["email"], new_password, user.first_name, user.last_name)
      conn
      |> put_flash(:info, "password has been sent to your email address")
      |> put_layout(false)
      |> redirect(to: Routes.session_path(conn, :index))
    end

  end

  def change_password(conn, _params) do
    conn
    |> put_layout(false)
    |> render("change_password.html")
  end

  def reset(conn, _params) do
    conn
    |> put_layout(false)
    |> render("reset.html")
  end

  #UPDATE PASSWORD AFTER CHANGE
  def update_password(conn, %{"email" => email} = params) do
    email = Users.find_by(email: email)
    Ecto.Multi.new()
    |> Ecto.Multi.update(:email, Users.changeset(email, %{password: params["password"], auto_password: Y}))
    |> Ecto.Multi.run(:logs, fn(_repo, %{email: email}) ->
      log =
        "\"#{email.email}\" changed password"

      logs = %{
        activity: log
      }

      User_logs.changeset(%User_logs{}, logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{email: _email, logs: _logs}} ->
           conn
           |> put_flash(
                :info,
                "password has changed successfully"
              )
           |> redirect(to: Routes.session_path(conn, :index))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.session_path(conn, :change_password))
       end
#  rescue
#    _ ->
#      conn
#      |> put_flash(:error, "An error occurred, reason unknown. try again")
#      |> redirect(to: Routes.user_path(conn, :index))

  end
  @doc """
    transverse errors
  """

  def traverse_errors(errors) do
    for {key, {msg, _opts}} <- errors, do: "#{key} #{msg}"
  end


end