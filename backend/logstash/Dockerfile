# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash:7.1.1
USER root
COPY postgresql-42.2.6.jar /opt/
# Add your logstash plugins setup here
RUN logstash-plugin install logstash-input-jdbc
# Example: RUN logstash-plugin install logstash-filter-json
RUN logstash-plugin install logstash-filter-aggregate