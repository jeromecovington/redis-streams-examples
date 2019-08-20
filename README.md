# redis-streams-examples

Some basic examples of redis streams producers, reading within a range of
messages, and consumer groups. Written in node.js using the [redis client](https://www.npmjs.com/package/redis).

Inspired by [redisnycstreams](https://github.com/itamarhaber/redisnycstreams).

---

## Resources

[Introduction to Redis Streams](https://redis.io/topics/streams-intro)

[Redis commands](https://redis.io/commands)

Easy redis docker setup:
- [docker image](https://hub.docker.com/_/redis/)
- [some tips](https://markheath.net/post/exploring-redis-with-docker)

## Running the examples

```shell
$ node producer-a.js
$ node reset.js
$ node producer-b.js
$ node range.js
$ node reset.js
$ node producer-a.js
# in a separate shell
$ node consumer-group.js
```

_fini_.
