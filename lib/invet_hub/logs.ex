defmodule InvetHub.Logs do
  @moduledoc """
  The Logs context.
  """

  import Ecto.Query, warn: false
  alias InvetHub.Repo

  alias InvetHub.Logs.User_logs
  alias InvetHub.Logs.System_logs

  @doc """
  Returns the list of tbl_user_logs.

  ## Examples

      iex> list_tbl_user_logs()
      [%UserLogs{}, ...]

  """
  def list_tbl_user_logs do
    Repo.all(User_logs)
  end

  def list_system_logs do
    Repo.all(System_logs)
  end

  @doc """
  Gets a single user_logs.ex.

  Raises `Ecto.NoResultsError` if the User logs does not exist.

  ## Examples

      iex> get_user_logs!(123)
      %UserLogs{}

      iex> get_user_logs!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user_logs!(id), do: Repo.get!(User_logs, id)

  @doc """
  Creates a user_logs.ex.

  ## Examples

      iex> create_user_logs(%{field: value})
      {:ok, %UserLogs{}}

      iex> create_user_logs(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user_logs(attrs \\ %{}) do
    %User_logs{}
    |> User_logs.changeset(attrs)
    |> Repo.insert()
  end
  def create_system_logs(attrs \\ %{}) do
    %System_logs{}
    |> System_logs.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user_logs.ex.

  ## Examples

      iex> update_user_logs(user_logs.ex, %{field: new_value})
      {:ok, %UserLogs{}}

      iex> update_user_logs(user_logs.ex, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_logs(%User_logs{} = user_logs, attrs) do
    user_logs
    |> User_logs.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user_logs.ex.

  ## Examples

      iex> delete_user_logs(user_logs.ex)
      {:ok, %UserLogs{}}

      iex> delete_user_logs(user_logs.ex)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user_logs(%User_logs{} = user_logs) do
    Repo.delete(user_logs)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user_logs.ex changes.

  ## Examples

      iex> change_user_logs(user_logs.ex)
      %Ecto.Changeset{source: %UserLogs{}}

  """
  def change_user_logs(%User_logs{} = user_logs) do
    User_logs.changeset(user_logs, %{})
  end

  # ========================== User Logs ============================
  def get_user_logs_by(user_id) do
    Repo.all(
      from u in User_logs,
      preload: [:user],
      where: u.user_id == ^user_id,
      select:
        map(u, [
          :id,
          :user_id,
          :inserted_at,
          :activity,
          user: [:first_name, :last_name, :email, :profile_name]
        ])
    )
  end

  def get_all_activity_logs do
    Repo.all(
      from u in User_logs,
      preload: [:user],
      select:
        map(u, [
          :id,
          :user_id,
          :profile_id,
          :profile,
          :branch,
          :inserted_at,
          :activity,
          user: [:first_name, :last_name, :email, :profile]
        ])

    )
  end

  # def get_logs_by_user_id(user_id) do
  #   Repo.get_by(UserLogs, user_id: id)
  # end
end