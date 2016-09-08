var table;

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable("groceries.tsv", "tsv", "header");
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}
function setup() {
  //count the columns
  println(table.getRowCount() + " total rows in table");
  println(table.getColumnCount() + " total columns in table");

}
