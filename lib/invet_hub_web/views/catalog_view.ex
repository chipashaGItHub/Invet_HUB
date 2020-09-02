defmodule InvetHubWeb.CatalogView do
  use InvetHubWeb, :view

  #get all branches from all the table branches
  def branch() do
    InvetHub.Catalog.Branch.all()
  end
    #  get all variations from the table variations
  def variations() do
     InvetHub.Catalog.Variation.all()
  end
end