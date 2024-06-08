# Import necessary library
import numpy as np

# Define the size of the board
board_size = 6

# Initialize the board with all empty slots
board = np.zeros((board_size, board_size), dtype=int)

# Define the players (1 for player 1 and -1 for player 2)
player1 = 1
player2 = -1

# Function to check if the column is full
def is_column_full(column):
    return board[0, column] != 0

# Function to insert a counter for a specific player in a column
def insert_counter(column, player):
    for row in range(board_size - 1, -1, -1):
        if board[row, column] == 0:
            board[row, column] = player
            break

# Function to check for a winning streak of 4 in a row, column, or diagonal
def check_winner(player):
    # Check rows
    for row in range(board_size):
        for col in range(board_size - 3):
            if board[row, col:col+4].sum() == 4 * player:
                return True

    # Check columns
    for col in range(board_size):
        for row in range(board_size - 3):
            if board[row:row+4, col].sum() == 4 * player:
                return True

    # Check diagonals from top-left to bottom-right
    for row in range(board_size - 3):
        for col in range(board_size - 3):
            if board[row:row+4, col:col+4].sum() == 4 * player:
                return True

    # Check diagonals from bottom-left to top-right
    for row in range(3, board_size):
        for col in range(board_size - 3):
            if board[row:row-4:-1, col:col+4].sum() == 4 * player:
                return True

    return False

# Main function to play the game
def play_connect_4():
    # Loop until the board is full or there is a winner
    while not np.all(board) and not check_winner(player1) and not check_winner(player2):
        # Player 1's turn
        print("Player 1's turn. Enter the column number (0-6):")
        column = int(input())
        while is_column_full(column):
            print("Column is full. Please choose another column.")
            column = int(input())
        insert_counter(column, player1)

        # Display the current board
        print("Current board:")
        print(board)

        if check_winner(player1):
            print("Player 1 wins!")
            break

        # Player 2's turn
        print("Player 2's turn. Enter the column number (0-6):")
        column = int(input())
        while is_column_full(column):
            print("Column is full. Please choose another column.")
            column = int(input())
        insert_counter(column, player2)

        # Display the current board
        print("Current board:")
        print(board)

        if check_winner(player2):
            print("Player 2 wins!")
            break

    # Check if the board is full and there is no winner
    if not np.all(board) and not check_winner(player1) and not check_winner(player2):
        print("It's a draw!")

# Call the main function to play the game
play_connect_4()
