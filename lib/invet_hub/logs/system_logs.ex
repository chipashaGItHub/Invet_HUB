defmodule InvetHub.Logs.System_logs do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  schema "tbl_system_logs" do
    field :activity, :string

    belongs_to :user, InvetHub.Accounts.User, foreign_key: :user_id, type: :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(user_log, attrs) do
    user_log
    |> cast(attrs, [
      :id,
      :activity,
      :user_id,
    ])
    |> validate_required([:activity])
  end
end