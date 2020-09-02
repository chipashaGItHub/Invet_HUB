defmodule InvetHub.Catalog.Branch do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  schema "tbl_branch" do
    field :branch, :string

    belongs_to :user, InvetHub.Accounts.User, foreign_key: :user_id, type: :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(branch, attrs) do
    branch
    |> cast(attrs, [
      :id,
      :branch,
      :user_id,

    ])
    |> validate_required([:branch])
  end
end