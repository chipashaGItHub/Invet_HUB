defmodule InvetHub.Catalog.Report do

  use Endon
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :integer, autogenerate: false}
  schema "tbl_reports" do
    field :total, :string
    field :quantity, :string
    field :branch, :string
    field :updated_at, :string
    field :inserted_at, :string
    field :difference, :string
    field :balance, :string

#    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(reports, attrs) do
    reports
    |> cast(attrs, [
      :id,
      :total,
      :quantity,
      :branch,
      :inserted_at,
      :updated_at,
      :diference,
      :balance,

    ])
    |> validate_required([:total, :quantity])
  end
end