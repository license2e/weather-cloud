import multiprocessing
import os

bind_port = os.environ.get("PORT", "8000")
bind = "0.0.0.0:{0}".format(bind_port)

worker_thread_count = int(os.environ.get("WEB_CONCURRENCY", multiprocessing.cpu_count() * 2 + 1))

workers = worker_thread_count
threads = worker_thread_count

accesslog = "-"

timeout = 30
graceful_timeout = 30