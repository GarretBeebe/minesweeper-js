$( document ).ready(function() {
  'use strict';

  var columns, rows, numberOfMines, remainingCells;
  var icons = {
    blank: 'http://i.imgur.com/HM1e3Tbb.jpg',
    pressed: 'http://i.imgur.com/bGT8xGEb.jpg',
    exposedBomb: 'http://i.imgur.com/pTJ8Swhb.jpg',
    explodedBomb: 'http://i.imgur.com/UFmXprFb.jpg',
    flag: 'http://i.imgur.com/nLPvW15b.jpg',
    bombs: [
      'http://i.imgur.com/Flqdqi1b.jpg',
      'http://i.imgur.com/bM8oExob.jpg',
      'http://i.imgur.com/bQKSbqYb.jpg',
      'http://i.imgur.com/5jNcEeVb.jpg',
      'http://i.imgur.com/BnxjHgHb.jpg',
      'http://i.imgur.com/RaFrMYcb.jpg',
      'http://i.imgur.com/GlwQOy0b.jpg',
      'http://i.imgur.com/8ngsVa8b.jpg',
      'http://i.imgur.com/lJ8P1wab.jpg'
    ]
  };

  var grid = [];

  function checkSuccess() {
    var currentCell;
    if (remainingCells === 0) {
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
          currentCell = $('#' + i + '_' + j);
          if (grid[i][j] == 1) {
            currentCell.prop('src', icons.flag);
          }
          currentCell.attr('onclick', 'init()');
        }

        remainingCells = -1;
      }
    }
  }

  function countMines(currentRow, currentColumn) {
    var number = 0;
    for (var x = Math.max(0, currentRow - 1); x <= Math.min(rows - 1, currentRow + 1); x++) {
      for (var y = Math.max(0, currentColumn - 1); y <= Math.min(columns - 1, currentColumn + 1); y++) {
        if (grid[x][y] == 1) {
          number++;
        }
      }
    }

    return number;
  }

  function generateBoard(rows, columns) {
    for (var i = 0; i < rows; i++) {
      grid[i] = [];
      for (var j = 0; j < columns; j++) {
        grid[i][j] = 0;
        $("#Board").append("<input type='image' class='square' id=" + i + "_" + j + " value='' />");
        $('#' + i + '_' + j).prop('src', icons.blank);
        $('#' + i + '_' + j).attr('onClick', "clickOnCell(" + i + "," + j + ")");
      }
      $("#Board").append('<br>');
    }
  }

  function generateMines(numberOfMines) {
    var i = 0;
    while (i < numberOfMines) {
      var x = Math.floor(Math.random() * rows);
      var y = Math.floor(Math.random() * columns);
      if (grid[x][y] === 0) {
        grid[x][y] = 1;
        i++;
      }
    }
  }

  function showMines(explodedMineX, explodedMineY) {
    var currentCell;
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        currentCell = $('#' + i + '_' + j);
        if (grid[i][j] == 1) {
          if (i == explodedMineX && j == explodedMineY) {
            currentCell.prop('src', icons.explodedBomb);
          }
          else {
            currentCell.prop('src', icons.exposedBomb);
          }
        }
        currentCell.attr('onClick', 'init()');
      }
    }
  }

  this.clickOnCell = function(currentRow, currentColumn) {
    var currentCell = $('#' + currentRow + '_' + currentColumn);
    if (grid[currentRow][currentColumn] == 1) {
      currentCell.addClass('clicked');
      showMines(currentRow, currentColumn);
    }
    else {
      currentCell.addClass('clicked');
      currentCell.attr('onClick', '');
      remainingCells--;
      var number = countMines(currentRow, currentColumn);
      if (number !== 0) {
        currentCell.prop('src', icons.bombs[number]);
      }
      else {
        currentCell.prop('src', icons.pressed);
        for (var x = Math.max(0, currentRow - 1); x <= Math.min(rows - 1, currentRow + 1); x++) {
          for (var y = Math.max(0, currentColumn - 1); y <= Math.min(columns - 1, currentColumn + 1); y++) {
            if (grid[x][y] <= 2 && ! $('#' + x + '_' + y).hasClass('clicked')) {
              this.clickOnCell(x, y);
            }
          }
        }
      }

      checkSuccess();
    }
  };

  this.init = function() {
    columns = $('#columns').val();
    rows = $('#rows').val();
    numberOfMines = $('#numberOfMines').val();
    remainingCells = columns * rows - numberOfMines;

    $('#Board').html('');
    $('#Board').height(rows * 21);
    $('#Board').width(columns * 21);

    generateBoard(rows, columns);
    generateMines(numberOfMines);
  };
});
