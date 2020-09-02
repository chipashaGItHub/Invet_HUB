defmodule InvetHubWeb.CatalogController do
  use InvetHubWeb, :controller

  alias InvetHub.Repo
  alias InvetHub.Logs.System_logs
  alias InvetHub.Catalog.Branch, as: Branch
  alias InvetHub.Catalog.Variation, as: Variation

  plug(
    InvetHubWeb.Plugs.RequireAuth
    when action in [
      :list_varations,
      :list_branch,
      :add_branch,
      :delete_branch,
      :update_branch,
      :add,
      :update,
      :delete
  
    ]
  )

  #list all values in the table variations
  def list_varations(conn, params) do
    render(conn, "variations.html")
  end

  #list all values in the table branches
  def list_branch(conn, params) do
    render(conn, "branch.html")
  end

# CRUDE FUNCTIONALITIES FOR BRANCH
############################################### ADD BRANCH ##############################
  def add_branch(conn, params) do

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:branch, Branch.changeset(%Branch{}, params))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{branch: branch}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" added a new branch: \"#{branch.branch}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{branch: branch, system_logs: system_logs}} ->
           conn
           |> put_flash(
                :info,
                "\"#{branch.branch}\" Branch added to the list successfully "
              )
           |> redirect(to: Routes.catalog_path(conn, :list_branch))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.catalog_path(conn, :list_branch))
       end
  rescue
    _ ->
      conn
      |> put_flash(:error, "An error occurred, reason unknown. try again")
      |> redirect(to: Routes.catalog_path(conn, :list_branch))
  end
  @doc """
        transverse errors
  """

  def traverse_errors(errors) do
    for {key, {msg, _opts}} <- errors, do: "#{key} #{msg}"
  end

  ###################################### DELETE BRANCH ##################################################
  def delete_branch(conn, %{"id" => id}) do
    branch = Branch.find(id)

    Ecto.Multi.new()
    |> Ecto.Multi.delete(:delete_all, branch)
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{delete_all: delete_all}) ->
      activity = "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Deleted branch: \"#{delete_all.branch}\" From the system"

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{delete_all: _delete_all, system_logs: _system_logs}} ->
           conn
           |> put_flash(:info, "Branch has been deleted successfully.")
           |> redirect(to: Routes.catalog_path(conn, :list_branch))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()

           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.catalog_path(conn, :list_branch))
       end
  end
############################################ EDIT BRANCH ###########################
  def update_branch(conn, %{"id" => id} = params) do
    branch = Branch.find(id)
    Ecto.Multi.new()
    |> Ecto.Multi.update(:branch, Branch.changeset(branch, params))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{branch: branch}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" updated Branch: \"#{branch.branch}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{branch: _branch, system_logs: _system_logs}} ->
           conn
           |> put_flash(
                :info,
                "Branch has been updated successfully"
              )
           |> redirect(to: Routes.catalog_path(conn, :list_branch))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.catalog_path(conn, :list_branch))
       end
     rescue
       _ ->
         conn
         |> put_flash(:error, "An error occurred, reason unknown. try again")
         |> redirect(to: Routes.user_path(conn, :index))

  end
  ################################### END OF CRUDE FOR BRANCH

  ######################################################## CRUDE FUNCTIONALITY FOR VARIATIONS ###########################
  ######################################### ADD variation
  def add(conn, params) do

    Ecto.Multi.new()
    |> Ecto.Multi.insert(:variation, Variation.changeset(%Variation{}, params))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{variation: variation}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Variation added with size: \"#{variation.size}\" and price: \"#{variation.price}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{variation: variation, system_logs: system_logs}} ->
           conn
           |> put_flash(
                :info,
                "\"size: #{variation.size}\" and \" Price: #{variation.price} ZMK\" Variation has been successfully"
              )
           |> redirect(to: Routes.catalog_path(conn, :list_varations))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.catalog_path(conn, :list_varations))
       end
  rescue
    _ ->
      conn
      |> put_flash(:error, "An error occurred, reason unknown. try again")
      |> redirect(to: Routes.catalog_path(conn, :list_varations))
  end

######################################## UPDATE VARIATION TABLE
  def update(conn, %{"id" => id} = params) do
    variation = Variation.find(id)
    Ecto.Multi.new()
    |> Ecto.Multi.update(:variation, Variation.changeset(variation, params))
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{variation: variation}) ->
      activity =
        "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Variation has been updated with size: \"#{variation.size}\" and price: \"#{variation.price}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{variation: _variation, system_logs: _system_logs}} ->
           conn
           |> put_flash(
                :info,
                "Variation has been updated successfully"
              )
           |> redirect(to: Routes.catalog_path(conn, :list_varations))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()
           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.catalog_path(conn, :list_varations))
       end
  rescue
    _ ->
      conn
      |> put_flash(:error, "An error occurred, reason unknown. try again")
      |> redirect(to: Routes.catalog_path(conn, :list_varations))

  end
################################################ DELETE VARIATIONS ##############
  def delete(conn, %{"id" => id}) do
    variation = Variation.find(id)

    Ecto.Multi.new()
    |> Ecto.Multi.delete(:delete_all, variation)
    |> Ecto.Multi.run(:system_logs, fn(_repo, %{delete_all: delete_all}) ->
      activity = "\"#{conn.assigns.user.first_name}\" \"#{conn.assigns.user.last_name}\" Deleted variations with variation size: \"#{delete_all.size}\" and price: \"#{delete_all.price}\""

      system_logs = %{
        user_id: conn.assigns.user.id,
        activity: activity
      }

      System_logs.changeset(%System_logs{}, system_logs)
      |> Repo.insert()
    end)
    |> Repo.transaction()
    |> case do
         {:ok, %{delete_all: _delete_all, system_logs: _system_logs}} ->
           conn
           |> put_flash(:info, "variations has been deleted successfully.")
           |> redirect(to: Routes.catalog_path(conn, :list_varations))

         {:error, _failed_operation, failed_value, _changes_so_far} ->
           reason = traverse_errors(failed_value.errors) |> List.first()

           conn
           |> put_flash(:error, reason)
           |> redirect(to: Routes.catalog_path(conn, :list_varations))
       end
  end

  def report(conn, params) do
    reports = Catalog.list_reports
    render(conn, "report.html", reports: reports)
  end
end