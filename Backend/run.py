from app import create_app
from livereload import Server

app = create_app()

if __name__ == '__main__':
    server = Server(app.wsgi_app)

    # Watch thư mục templates và static để reload
    server.watch('app/templates/')
    server.watch('app/static/')

    # Chạy server với live reload
    server.serve(port=5000, debug=True)
