function formatTimestamp(timestamp, decision){
    if (decision === "short"){
        return timestamp.toLocaleString("en-SE", {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    }
    else{
        return timestamp.toLocaleString("en-SE", {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            year: 'numeric'
        });
    }
}

export default formatTimestamp;