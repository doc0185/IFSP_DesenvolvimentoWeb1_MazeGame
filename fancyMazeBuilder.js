class FancyMazeBuilder extends MazeBuilder {

  // Original JavaScript code by Chirp Internet: www.chirpinternet.eu
  // Please acknowledge use of this code by including this header.

  constructor(width, height) {

    super(width, height);

    
    this.placeSentinels(100);
    this.placeKey();

  }

  isA(value, ...cells) {
    return cells.every((array) => {
      let row, col;
      [row, col] = array;
      if((this.maze[row][col].length == 0) || !this.maze[row][col].includes(value)) {
        return false;
      }
      return true;
    });
  }

  
  placeSentinels(percent = 100) {

    percent = parseInt(percent, 10);

    if((percent < 1) || (percent > 100)) {
      percent = 100;
    }

    this.maze.slice(1, -1).forEach((row, idx) => {

      let r = idx + 1;

      row.slice(1, -1).forEach((cell, idx) => {

        let c = idx + 1;

        if(!this.isA("wall", [r,c])) {
          return;
        }

        if(this.rand(1, 100) > percent) {
          return;
        }

        if(this.isA("wall", [r-1,c-1],[r-1,c],[r-1,c+1],[r+1,c-1],[r+1,c],[r+1,c+1])) {
          this.maze[r][c].push("sentinel");
        }

        if(this.isA("wall", [r-1,c-1],[r,c-1],[r+1,c-1],[r-1,c+1],[r,c+1],[r+1,c+1])) {
          this.maze[r][c].push("sentinel");
        }

      });

    });
  }

  placeKey() {

    let fr, fc;
    [fr, fc] = this.getKeyLocation();
    this.maze[fr][fc] = ["key"];
    

  }

}