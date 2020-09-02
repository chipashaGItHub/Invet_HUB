defmodule InvetHubWeb.InventoryView do
  use InvetHubWeb, :view
#  alias InvetHub.RepoInventory
#
#  def estimated_profit() do
#    estimated_profit = RepoInventory.estimated_profit()
#  end
#
#  def total_goods() do
#    total_goods = RepoInventory.total_goods()
#  end
#
#  def  total_revenue() do
#    total_revenue = RepoInventory.total_revenue
#  end
#
#  def average_income() do
#    average_income = RepoInventory.average_income
#  end
  #get all values in the table inventory
  def inventory() do
    InvetHub.Inventory.Inventory.all()
  end
#
  #get all branches from all the table branches
  def branch() do
  InvetHub.Catalog.Branch.all()
  end
  #  get all variations from the table variations
  def variation() do
    InvetHub.Catalog.Variation.all()
  end

end